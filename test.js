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

const init = async () => {
  console.log('testing public file');
  await loadD3();
  console.log('D£: ', d3);
}

init();


