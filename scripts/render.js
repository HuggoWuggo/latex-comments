const temml = require('temml');
const latex = process.argv[2];
if (!latex) process.exit(1);

const { JSDOM } = require('jsdom');

function toUnicode(mathml) {
  const sup_map = {
    '0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹',
    'n':'ⁿ','i':'ⁱ','x':'ˣ','a':'ᵃ','b':'ᵇ','c':'ᶜ','d':'ᵈ','e':'ᵉ','f':'ᶠ',
    'g':'ᵍ','h':'ʰ','j':'ʲ','k':'ᵏ','l':'ˡ','m':'ᵐ','o':'ᵒ','p':'ᵖ','r':'ʳ',
    's':'ˢ','t':'ᵗ','u':'ᵘ','v':'ᵛ','w':'ʷ','y':'ʸ','z':'ᶻ',
    '+':'⁺','-':'⁻','=':'⁼','(':'⁽',')':'⁾'
  };
  const sub_map = {
    '0':'₀','1':'₁','2':'₂','3':'₃','4':'₄','5':'₅','6':'₆','7':'₇','8':'₈','9':'₉',
    'i':'ᵢ','j':'ⱼ','n':'ₙ','x':'ₓ','a':'ₐ','e':'ₑ','o':'ₒ','r':'ᵣ','u':'ᵤ','v':'ᵥ',
    '+':'₊','-':'₋','=':'₌'
  };

  function applyMap(str, map) {
    return [...str].map(c => map[c] !== undefined ? map[c] : c).join('');
  }

  function parseNode(node) {
    const tag = node.tagName;
    const children = [...node.childNodes];

    if (node.nodeType === 3) return node.textContent; // text node

    switch(tag) {
      case 'msup': {
        const [base, exp] = children.filter(c => c.nodeType === 1);
        return parseNode(base) + applyMap(parseNode(exp), sup_map);
      }
      case 'msub': {
        const [base, sub] = children.filter(c => c.nodeType === 1);
        return parseNode(base) + applyMap(parseNode(sub), sub_map);
      }
      case 'msubsup': {
        const [base, sub, sup] = children.filter(c => c.nodeType === 1);
        return parseNode(base) + applyMap(parseNode(sub), sub_map) + applyMap(parseNode(sup), sup_map);
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
  return parseNode(root);
}

const mathml = temml.renderToString(latex, {});

console.log(toUnicode(mathml));
