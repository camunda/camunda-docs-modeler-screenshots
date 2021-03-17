// Make eslint happy
let document;

module.exports.addAnnotation = function addAnnotation(selector, text, options = { x: 0, y: 50 }) {
  const el = document.querySelector(selector);

  const bb = el.getBoundingClientRect();

  const textBox = document.createElement('div');
  textBox.style.padding = '15px 30px';
  textBox.style.backgroundColor = '#dcecff';
  textBox.style.border = '2px solid black';
  textBox.style.position = 'absolute';
  textBox.style.zIndex = '9999999';
  textBox.style.fontSize = '18px';
  textBox.style.whiteSpace = 'pre-wrap';
  textBox.style.textAlign = 'center';
  textBox.classList.add('SCREENSHOT__ANNOTATION');
  textBox.textContent = text;

  document.body.appendChild(textBox);

  // This calculates the positioning of the text box and the arrow
  // left, top: css properties of the textbox
  // c[x/y][s/e]: [s]tart/[e]nd [c]oordinates for [x]- and [y] axis of the svg arrow
  let left, top, cxs, cxe, cys, cye;
  if (Math.abs(options.x) > Math.abs(options.y)) {
    cys = bb.y + bb.height / 2;
    cye = cys + options.y;
    top = cye - textBox.clientHeight / 2;
    if (options.x > 0) {

      // right
      cxs = bb.x + bb.width + 5;
      left = cxs + options.x;
    } else {

      // left
      cxs = bb.x;
      left = bb.x - textBox.clientWidth + options.x - 5;
    }
    cxe = cxs + options.x;
  } else {
    cxs = bb.x + bb.width / 2;
    cxe = cxs + options.x;
    left = cxe - textBox.clientWidth / 2;
    if (options.y > 0) {

      // bottom
      cys = bb.y + bb.height + 5;
      top = cys + options.y;
    } else {

      // top
      cys = bb.y - 5;
      top = bb.y - textBox.clientHeight + options.y;
    }
    cye = cys + options.y;
  }

  textBox.style.top = top + 'px';
  textBox.style.left = left + 'px';

  const svgC = document.createElement('div');
  svgC.style.position = 'absolute';
  svgC.style.zIndex = '99999999';
  svgC.style.top = '0';
  svgC.classList.add('SCREENSHOT__ANNOTATION');

  const height = Math.max(top + textBox.clientHeight, bb.y + bb.height);
  const width = Math.max(left + textBox.clientWidth, bb.x + bb.width);

  svgC.innerHTML = `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" style="width: ${width}px; height: ${height}px;">
  <defs>
    <!-- arrowhead marker definition -->
    <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z"></path>
    </marker>
  </defs>

  <polyline points="${cxe},${cye}, ${cxs},${cys}" fill="none" stroke="black" stroke-width="3" marker-end="url(#arrow)"></polyline>
</svg>`;

  document.body.appendChild(svgC);
};

module.exports.connectTwoElements = function connectTwoElements(selector1, selector2) {
  const el1 = document.querySelector(selector1);
  const el2 = document.querySelector(selector2);

  const bb1 = el1.getBoundingClientRect();
  const bb2 = el2.getBoundingClientRect();

  let cxe, cye, cxs, cys;

  if (Math.abs((bb1.x + bb1.width/2) - (bb2.x + bb2.width/2)) > Math.abs((bb1.y + bb1.height/2) - (bb2.y + bb2.height/2))) {

    // arrow to the sides
    cys = bb1.y + bb1.height / 2;
    cye = bb2.y + bb2.height / 2;
    if (bb1.x - bb2.x < 0) {

      // To the right
      cxs = bb1.x + bb1.width;
      cxe = bb2.x;
    } else {

      // to the left
      cxs = bb1.x;
      cxe = bb2.x + bb2.width;
    }
  } else {

    // arrow top or bottom
    cxs = bb1.x + bb1.width / 2;
    cxe = bb2.x + bb2.width / 2;

    if (bb1.y - bb2.y < 0) {

      // To the right
      cys = bb1.y + bb1.height;
      cye = bb2.y;
    } else {

      // to the left
      cys = bb1.y;
      cye = bb2.y + bb2.height;
    }
  }

  const svgC = document.createElement('div');
  svgC.style.position = 'absolute';
  svgC.style.zIndex = '99999999';
  svgC.style.top = '0';
  svgC.classList.add('SCREENSHOT__ANNOTATION');

  const height = Math.max(bb1.y + bb1.height, bb2.y + bb2.height);
  const width = Math.max(bb1.x + bb1.width, bb2.x + bb2.width);
  svgC.innerHTML = `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" style="width: ${width}px; height: ${height}px;">
  <defs>
    <!-- arrowhead marker definition -->
    <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z"></path>
    </marker>
  </defs>

  <polyline points="${cxs},${cys}, ${cxe},${cye}" fill="none" stroke="black" stroke-width="3" marker-end="url(#arrow)"></polyline>
</svg>`;

  document.body.appendChild(svgC);
};

module.exports.clearAllAnnotations = function clearAllAnnotations() {
  const nodes = document.querySelectorAll('.SCREENSHOT__ANNOTATION');

  nodes.forEach((node) => {
    document.body.removeChild(node);
  });
};
