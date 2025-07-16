function loadD3() {
  return new Promise((resolve, reject) => {
    // If D3 is already loaded, resolve immediately
    if (window.d3) {
      resolve(window.d3);
      return;
    }

    // Create the script tag
    const d3Script = document.createElement('script');
    d3Script.src = `https://d3js.org/d3.v7.min.js`;
    d3Script.async = true;

    // Resolve on load
    d3Script.onload = () => {
      if (window.d3) {
        resolve(window.d3);
      } else {
        reject(new Error('D3 failed to load.'));
      }
    };

    // Reject on error
    d3Script.onerror = () => reject(new Error('Failed to load D3 script.'));

    // Inject script into document
    document.head.appendChild(d3Script);
  });
}

const doStuff = () => {
  // Create slider container
  const wrapper = document.createElement('div');
  wrapper.className = 'bubble-chart';
  wrapper.innerHTML = `
    <svg width="900" height="500"></svg>

    <div clasName="slider-container" style="display:flex; flex-direction: column;">
    <label>Times Shown (Bubble Size): <span id="sizeVal">50</span>
    <input id="sizeSlider" type="range" min="1" max="50" value="50">
    </label>


    <label>Days Running (X-axis): <span id="xVal">9</span>
    <input id="xSlider" type="range" min="0" max="11" value="9">
    </label>


    <label>Effectiveness (Y-axis): <span id="yVal">2</span>
    <input id="ySlider" type="range" min="-3" max="3" step="0.1" value="2"></label>
    </div>

  `;
  document.querySelector('#widget').appendChild(wrapper);

  const svg = d3.select(wrapper).select('svg');
  const width = +svg.attr('width') - 100;
  const height = +svg.attr('height') - 100;
  const margin = { top: 20, right: 60, bottom: 50, left: 60 };

  const data = [
    { name: 'FB Ads', days: 9, effectiveness: 2, timesShown: 50 },
    { name: 'Reels', days: 2, effectiveness: 2, timesShown: 45 },
    { name: 'Display', days: 1, effectiveness: 1, timesShown: 10 },
    { name: 'Email', days: 2, effectiveness: -1.5, timesShown: 8 },
    { name: 'AdWords', days: 3, effectiveness: -2, timesShown: 30 },
    { name: 'Short Messages', days: 3, effectiveness: 1.2, timesShown: 12 },
    { name: 'Banners', days: 4, effectiveness: 1.1, timesShown: 20 },
    { name: 'Hello Bar', days: 6, effectiveness: 1.3, timesShown: 10 },
    {
      name: 'Google Remarketing',
      days: 7,
      effectiveness: -1.5,
      timesShown: 35,
    },
    { name: 'IG Story', days: 8, effectiveness: 1.5, timesShown: 45 },
  ];
  const x = d3.scaleLinear().domain([0, 11]).range([margin.left, width]);
  const y = d3.scaleLinear().domain([-3, 3]).range([height, margin.top]);
  const r = d3.scaleSqrt().domain([1, 50]).range([5, 40]);
  const color = d3.scaleSequential(d3.interpolateRdYlGn).domain([50, 1]);

  svg
    .append('g')
    .attr('transform', `translate(0,${y(0)})`)
    .call(d3.axisBottom(x));

  svg
    .append('g')
    .attr('transform', `translate(${margin.left},0)`)
    .call(d3.axisLeft(y));

  const circles = svg
    .selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('stroke', '#333');

  const labels = svg
    .selectAll('text.label')
    .data(data)
    .enter()
    .append('text')
    .attr('class', 'label')
    .attr('font-size', '12px')
    .attr('text-anchor', 'middle');

  function update() {
    circles
      .attr('cx', (d) => x(d.days))
      .attr('cy', (d) => y(d.effectiveness))
      .attr('r', (d) => r(d.timesShown))
      .attr('fill', (d) => color(d.timesShown));

    labels
      .attr('x', (d) => x(d.days))
      .attr('y', (d) => y(d.effectiveness) + 4)
      .text((d) => d.name);
  }

  update();

  // Hook up sliders to FB Ads
  const fb = data[0];

  wrapper.querySelector('#sizeSlider').addEventListener('input', (e) => {
    fb.timesShown = Number(e.target.value);
    wrapper.querySelector('#sizeVal').textContent = fb.timesShown;
    update();
  });

  wrapper.querySelector('#xSlider').addEventListener('input', (e) => {
    fb.days = Number(e.target.value);
    wrapper.querySelector('#xVal').textContent = fb.days;
    update();
  });

  wrapper.querySelector('#ySlider').addEventListener('input', (e) => {
    fb.effectiveness = Number(e.target.value);
    wrapper.querySelector('#yVal').textContent = fb.effectiveness;
    update();
  });
};

const init = async () => {
  console.log('testing public file');
  await loadD3();
  console.log('D£: ', d3);
  doStuff();
};

init();
