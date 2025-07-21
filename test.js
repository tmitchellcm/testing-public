const loadScript = (scriptUrl) => {
  return new Promise((resolve, reject) => {
    // Create the script tag
    const script = document.createElement('script');
    script.src = scriptUrl;
    script.async = true;

    // Resolve on load
    script.onload = () => {
      console.log('loaded script: ', scriptUrl);
      resolve();
    };

    // Reject on error
    script.onerror = () =>
      reject(new Error(`Failed to load resource at ${scriptUrl}`));

    // Inject script into document
    document.head.appendChild(script);
  });
};

const doStuff = () => {
  // constants
  console.log('widget constants: ', widgetConstants.KPI_1_RATE);
  //css
  const style = document.createElement('style');
  style.innerHTML = `
    .highlighted {
        outline: 2px solid mediumpurple;
        outline-offset: -2px;
    }
    `;
  document.head.appendChild(style);
  // create HTML bits
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
  <div style="width: 100%;height: 100vh;max-width: 1000px;margin: 0 auto;" id="chartContainer"></div>
  <div style="max-width: 1000px; margin: 20px auto">
    <label>X Benchmark: <input type="range" id="xBenchSlider" min="0" max="100" value="50"> <span id="xBenchVal">50</span></label>
    <br>
    <label>Y Benchmark: <input type="range" id="yBenchSlider" min="0" max="100" value="50"> <span id="yBenchVal">50</span></label>
  </div>
  <div id="tableContainer" style="max-width: 1000px; margin: 20px auto"></div>
  `;
  document.querySelector('#widget').appendChild(wrapper);

  // JS
  window.addEventListener('resize', () => {
    chart.resize();
  });
  let xBenchmark = 50;
  let yBenchmark = 50;
  const data = [...Array(12)].map((_, i) => ({
    name: String.fromCharCode(65 + i),
    x: Math.floor(Math.random() * 100),
    y: Math.floor(Math.random() * 100),
    r: Math.floor(Math.random() * 20 + 10),
  }));
  const quadrantColors = {
    BOOST: '#a6f1ff', //blue
    ITERATE: '#c8e6c9', //green
    MONITOR: '#ffe082', //yellow
    CUT: '#ef9a9a', //red
  };

  function getQuadrant(d) {
    if (d.y > yBenchmark && d.x <= xBenchmark) {
      return 'BOOST';
    }
    if (d.y > yBenchmark && d.x >= xBenchmark) {
      return 'ITERATE';
    }
    if (d.y <= yBenchmark && d.x <= xBenchmark) {
      return 'MONITOR';
    }
    return 'CUT';
  }
  let selectedPointName = null;
  const chart = echarts.init(document.getElementById('chartContainer'));
  const seriesData = data.map((d) => ({
    name: d.name,
    value: [d.x, d.y, d.r],
    symbolSize: d.r,
    itemStyle: {
      color: 'mediumpurple',
      borderColor: '#7b68ee',
      borderWidth: 1,
    },
    label: {
      show: true,
      position: 'top',
      formatter: d.name,
      fontSize: 10,
    },
  }));

  function renderChart() {
    const option = {
      xAxis: {
        name: 'Impressions',
        min: 0,
        max: 100,
      },
      yAxis: {
        name: 'Performance',
        min: 0,
        max: 100,
      },
      tooltip: {
        trigger: 'item',
        backgroundColor: 'red',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 20,
        textStyle: {
          color: '#333',
          fontSize: 12,
          fontFamily: 'sans-serif',
        },
      },
      series: [
        {
          type: 'custom',
          renderItem: function (params, api) {
            const x0 = api.coord([0, 0]);
            const xMid = api.coord([xBenchmark, 0]);
            const xMax = api.coord([100, 0]);
            const y0 = api.coord([0, 0]);
            const yMid = api.coord([0, yBenchmark]);
            const yMax = api.coord([0, 100]);
            return {
              type: 'group',
              children: [
                {
                  type: 'rect',
                  shape: {
                    x: x0[0],
                    y: yMid[1],
                    width: xMid[0] - x0[0],
                    height: y0[1] - yMid[1],
                  },
                  style: {
                    fill: quadrantColors.MONITOR,
                    opacity: 0.2,
                  },
                },
                {
                  type: 'rect',
                  shape: {
                    x: xMid[0],
                    y: yMid[1],
                    width: xMax[0] - xMid[0],
                    height: y0[1] - yMid[1],
                  },
                  style: {
                    fill: quadrantColors.CUT,
                    opacity: 0.2,
                  },
                },
                {
                  type: 'rect',
                  shape: {
                    x: x0[0],
                    y: yMax[1],
                    width: xMid[0] - x0[0],
                    height: yMid[1] - yMax[1],
                  },
                  style: {
                    fill: quadrantColors.BOOST,
                    opacity: 0.2,
                  },
                },
                {
                  type: 'rect',
                  shape: {
                    x: xMid[0],
                    y: yMax[1],
                    width: xMax[0] - xMid[0],
                    height: yMid[1] - yMax[1],
                  },
                  style: {
                    fill: quadrantColors.ITERATE,
                    opacity: 0.2,
                  },
                },
              ],
            };
          },
          data: [0],
          z: -10,
        },
        {
          type: 'scatter',
          data: seriesData,
        },
        {
          type: 'line',
          animation: false,
          markLine: {
            symbol: 'none',
            data: [
              {
                xAxis: xBenchmark,
              },
            ],
            lineStyle: {
              type: 'solid',
              color: 'red',
            },
          },
        },
        {
          type: 'line',
          animation: false,
          markLine: {
            symbol: 'none',
            data: [
              {
                yAxis: yBenchmark,
              },
            ],
            lineStyle: {
              type: 'dashed',
              color: '#000',
            },
          },
        },
      ],
    };
    chart.setOption(option);
  }
  renderChart();

  document.getElementById('xBenchSlider').addEventListener('input', (e) => {
    xBenchmark = +e.target.value;
    document.getElementById('xBenchVal').textContent = xBenchmark;
    renderChart();
    renderTable();
  });
  document.getElementById('yBenchSlider').addEventListener('input', (e) => {
    yBenchmark = +e.target.value;
    document.getElementById('yBenchVal').textContent = yBenchmark;
    renderChart();
    renderTable();
  });
  chart.on('click', function (params) {
    if (params.seriesType === 'scatter') {
      selectedPointName = params.data.name;
      renderTable();
    }
  });
  const { createTable, getCoreRowModel } = TableCore;
  const tableState = {
    pagination: {
      pageIndex: 0,
      pageSize: 5,
    },
  };

  function renderTable() {
    const tableContainer = document.getElementById('tableContainer');
    tableContainer.innerHTML = '';
    const table = createTable({
      data,
      state: tableState,
      getRowId: (row) => row.name,
      getCoreRowModel: getCoreRowModel(),
      columns: [
        {
          id: 'name',
          accessorKey: 'name',
          header: 'Name',
        },
        {
          id: 'x',
          accessorKey: 'x',
          header: 'Impressions',
        },
        {
          id: 'y',
          accessorKey: 'y',
          header: 'Performance',
        },
        {
          id: 'r',
          accessorKey: 'r',
          header: 'Size',
        },
      ],
    });
    const tableEl = document.createElement('table');
    tableEl.style.width = '100%';
    tableEl.style.borderCollapse = 'collapse';
    const thead = document.createElement('thead');
    const headRow = document.createElement('tr');
    table.getAllLeafColumns().forEach((col) => {
      const th = document.createElement('th');
      th.textContent = col.columnDef.header;
      th.style.border = '1px solid #aaa';
      th.style.padding = '6px';
      headRow.appendChild(th);
    });
    thead.appendChild(headRow);
    tableEl.appendChild(thead);
    const tbody = document.createElement('tbody');
    table.getRowModel().rows.forEach((row) => {
      const tr = document.createElement('tr');
      const quadrant = getQuadrant(row.original);
      tr.style.backgroundColor = quadrantColors[quadrant];
      if (row.original.name === selectedPointName) {
        tr.classList.add('highlighted');
      }
      row.getAllCells().forEach((cell) => {
        const td = document.createElement('td');
        td.textContent = cell.getValue();
        td.style.border = '1px solid #ccc';
        td.style.padding = '6px';
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    tableEl.appendChild(tbody);
    tableContainer.appendChild(tableEl);
  }
  renderTable();
};

const init = async () => {
  console.log('testing public file');
  await loadScript(
    `https://cdn.jsdelivr.net/npm/echarts@5.5.0/dist/echarts.min.js`
  );
  await loadScript(
    `https://unpkg.com/@tanstack/table-core@8.5.15/build/umd/index.production.js`
  );

  doStuff();
};

init();
