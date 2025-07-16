console.log('testing public file');

//console.log(JSON.stringify(DA.query.getQueryResult(), null,2));

//console.log(JSON.stringify(DA));

function loadD3() {
  return new Promise((resolve, reject) => {
    // If D3 is already loaded, resolve immediately
    if (window.d3) {
      resolve(window.d3);
      return;
    }

    // Create the script tag
    const script = document.createElement('script');
    script.src = `https://d3js.org/d3.v7.min.js`;
    script.async = true;

    // Resolve on load
    script.onload = () => {
      if (window.d3) {
        resolve(window.d3);
      } else {
        reject(new Error('D3 failed to load.'));
      }
    };

    // Reject on error
    script.onerror = () => reject(new Error('Failed to load D3 script.'));

    // Inject script into document
    document.head.appendChild(script);
  });
}

const init = async () => {
  await loadD3();
  console.log('D3: ', d3)
}

init();
