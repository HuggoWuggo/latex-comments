const temml = require('temml');
const latex = process.argv[2].replace(/\\:/g, ' ');
if (!latex) process.exit(1);

const { JSDOM } = require('jsdom');

function toUnicode(mathml) {
  mathml = mathml.replace(/[\u2061\u2062\u2063\u2064]/g, '');
  const sup_map = {
    '0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹',
    'a':'ᵃ','b':'ᵇ','c':'ᶜ','d':'ᵈ','e':'ᵉ','f':'ᶠ','g':'ᵍ','h':'ʰ','i':'ⁱ','j':'ʲ',
    'k':'ᵏ','l':'ˡ','m':'ᵐ','n':'ⁿ','o':'ᵒ','p':'ᵖ','r':'ʳ','s':'ˢ','t':'ᵗ','u':'ᵘ',
    'v':'ᵛ','w':'ʷ','x':'ˣ','y':'ʸ','z':'ᶻ',
    '+':'⁺','-':'⁻','=':'⁼','(':'⁽',')':'⁾',
    'π':'^π ',  // no pi superscript exists, best approximation
  };

  const sub_map = {
    '0':'₀','1':'₁','2':'₂','3':'₃','4':'₄','5':'₅','6':'₆','7':'₇','8':'₈','9':'₉',
    'a':'ₐ','b':'♭','c':'꜀','d':'ᑯ','e':'ₑ','f':'բ','g':'ց','h':'ₕ','i':'ᵢ','j':'ⱼ',
    'k':'ₖ','l':'ₗ','m':'ₘ','n':'ₙ','o':'ₒ','p':'ₚ','r':'ᵣ','s':'ₛ','t':'ₜ','u':'ᵤ',
    'v':'ᵥ','w':'ᵥᵥ','x':'ₓ','y':'ᵧ','z':'₂',
    '+':'₊','-':'₋','=':'₌',
    'π':'_π ',  // no pi subscript exists, leave as-is
  };

  function applyMap(str, map) {
    return [...str].map(c => map[c] !== undefined ? map[c] : c).join('');
  }

  function parseNode(node) {
    const tag = node.tagName;
    const children = [...node.childNodes];

    if (node.nodeType === 3) return node.textContent; // text node

    switch(tag) {
      // case 'msup': {
      //   const [base, exp] = children.filter(c => c.nodeType === 1);
      //   return parseNode(base) + applyMap(parseNode(exp), sup_map) + '';
      // }
      // case 'msub': {
      //   const [base, sub] = children.filter(c => c.nodeType === 1);
      //   return parseNode(base) + applyMap(parseNode(sub), sub_map) + '';
      // }
      // case 'msubsup': {
      //   const [base, sub, sup] = children.filter(c => c.nodeType === 1);
      //   return parseNode(base) + applyMap(parseNode(sub), sub_map) + applyMap(parseNode(sup), sup_map);
      // }
      case 'msub': {
        const [base, sub] = children.filter(c => c.nodeType === 1);
        const subText = parseNode(sub);
        const mapped = subText.length === 1 ? applyMap(subText, sub_map) : `(${subText})`;
        return parseNode(base) + mapped;
      }
      case 'msup': {
        const [base, exp] = children.filter(c => c.nodeType === 1);
        const expText = parseNode(exp);
        const mapped = expText.length === 1 ? applyMap(expText, sup_map) : `(${expText})`;
        return parseNode(base) + mapped;
      }
      case 'msubsup': {
        const [base, sub, sup] = children.filter(c => c.nodeType === 1);
        const subText = parseNode(sub);
        const supText = parseNode(sup);
        const mappedSub = subText.length === 1 ? applyMap(subText, sub_map) : `(${subText})`;
        const mappedSup = supText.length === 1 ? applyMap(supText, sup_map) : `(${supText})`;
        return parseNode(base) + mappedSub + mappedSup;
      }
      case 'mfrac': {
        const [num, den] = children.filter(c => c.nodeType === 1);
        return '(' + parseNode(num) + ')/(' + parseNode(den) + ')';
      }
      case 'msqrt': {
        const inner = children.map(parseNode).join('');
        return '√(' + inner + ')';
      }
      default:
        return children.map(parseNode).join('');
    }
  }

  const dom = new JSDOM(mathml, { contentType: 'text/xml' });
  const root = dom.window.document.querySelector('math');
  return parseNode(root).trim();
}

const mathml = temml.renderToString(latex, {});

console.log(toUnicode(mathml));
