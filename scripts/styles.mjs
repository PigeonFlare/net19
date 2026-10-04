import * as csstree from 'css-tree';
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';

export const SAFE_ATTRIBUTE = 'data-n19-safe';

const GEOMETRY = /^(?:display|position|top|right|bottom|left|inset(?:-.+)?|float|clear|(?:min-|max-)?(?:width|height|inline-size|block-size)|margin(?:-.+)?|padding(?:-.+)?|flex(?:-.+)?|grid(?:-.+)?|order|gap|row-gap|column-gap|columns|column-(?:count|width|span|fill)|justify-.+|align-.+|place-.+|overflow(?:-.+)?|transform(?:-.+)?|translate|rotate|scale|z-index|contain(?:-.+)?|aspect-ratio|zoom|box-sizing|white-space|-webkit-line-clamp|line-clamp|-webkit-box-orient|table-layout|resize|writing-mode|all)$/;

const ungated = csstree.parse(`:where(:root:not([${SAFE_ATTRIBUTE}]))`, { context: 'selector' }).children.first;

export const isLayout = (property, value) => {
  const name = property.toLowerCase();
  if (name.startsWith('--') || !GEOMETRY.test(name)) return false;
  return !(name === 'display' && /^none\s*$/i.test(value));
};

function nestedIn(selector, parent) {
  if (!parent) return selector;
  const list = csstree.parse(selector, { context: 'selectorList' });
  list.children.forEach(complex => {
    let nested = false;
    csstree.walk(complex, { visit: 'NestingSelector', enter() { nested = true; } });
    if (nested) return;
    complex.children.prependData({ type: 'Combinator', name: ' ' });
    complex.children.prependData({ type: 'NestingSelector' });
  });
  const parentText = `:is(${parent})`;
  return csstree.generate(list).replace(/&/g, parentText);
}

function gate(selector) {
  const list = csstree.parse(selector, { context: 'selectorList' });
  const variants = [];
  list.children.forEach(complex => {
    const nodes = complex.children.toArray();
    const firstCombinator = nodes.findIndex(node => node.type === 'Combinator');
    const first = firstCombinator < 0 ? nodes : nodes.slice(0, firstCombinator);
    const type = first.find(node => node.type === 'TypeSelector')?.name.toLowerCase();
    const isRoot = type === 'html' || first.some(node => node.type === 'PseudoClassSelector' && node.name === 'root');
    const canBeRoot = isRoot || !type || type === '*';
    if (!isRoot) {
      const prefixed = csstree.clone(complex);
      prefixed.children.prependData({ type: 'Combinator', name: ' ' });
      prefixed.children.prependData(csstree.clone(ungated));
      variants.push(csstree.generate(prefixed));
    }
    if (canBeRoot) {
      const pseudoElement = first.findIndex(node => node.type === 'PseudoElementSelector');
      const at = pseudoElement < 0 ? first.length : pseudoElement;
      const appended = [...nodes.slice(0, at), csstree.clone(ungated), ...nodes.slice(at)];
      variants.push(appended.map(node => csstree.generate(node)).join(''));
    }
  });
  return variants.join(',');
}

function compileBlock(block, parent, out) {
  let run = [];
  const flush = () => {
    if (!run.length) return;
    const text = list => list.map(d => `${d.property}:${d.value}${d.important ? '!important' : ''}`).join(';');
    let gated = null;
    for (let i = 0; i < run.length;) {
      const layout = isLayout(run[i].property, run[i].value);
      let end = i;
      while (end < run.length && isLayout(run[end].property, run[end].value) === layout) end++;
      out.push(`${layout ? (gated ??= gate(parent)) : parent}{${text(run.slice(i, end))}}`);
      i = end;
    }
    run = [];
  };
  block.children.forEach(node => {
    if (node.type === 'Declaration') {
      if (!parent) throw new Error(`declaration outside a rule: ${node.property}`);
      run.push({ property: node.property, value: csstree.generate(node.value).trim(), important: node.important });
      return;
    }
    flush();
    if (node.type === 'Rule') compileBlock(node.block, nestedIn(csstree.generate(node.prelude), parent), out);
    else if (node.type === 'Atrule' && node.block && /^(?:media|supports|container|layer|scope)$/.test(node.name)) {
      const inner = [];
      compileBlock(node.block, parent, inner);
      if (inner.length) out.push(`@${node.name} ${node.prelude ? csstree.generate(node.prelude) : ''}{${inner.join('')}}`);
    } else if (node.type === 'Atrule') {
      if (parent) throw new Error(`@${node.name} inside a rule`);
      out.push(csstree.generate(node));
    } else throw new Error(`unparsed CSS near: ${csstree.generate(node).slice(0, 80)}`);
  });
  flush();
}

export function compileTheme(css) {
  const ast = csstree.parse(css, { parseValue: false, parseCustomProperty: false, parseAtrulePrelude: true,
    onParseError: error => { throw new Error(`${error.message} at line ${error.line}`); } });
  const out = [];
  compileBlock(ast, null, out);
  return out.join('\n') + '\n';
}

export async function buildStyles(root) {
  const source = new URL('themes/', root), target = new URL('dist/themes/', root);
  await rm(target, { recursive: true, force: true });
  await mkdir(target, { recursive: true });
  for (const file of (await readdir(source)).filter(name => name.endsWith('.css')).sort()) {
    try {
      await writeFile(new URL(file, target), compileTheme(await readFile(new URL(file, source), 'utf8')));
    } catch (error) {
      throw new Error(`themes/${file}: ${error.message}`);
    }
  }
}
