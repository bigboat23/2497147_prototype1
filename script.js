document.addEventListener('DOMContentLoaded', () => {
  const blogButton = document.getElementById('blogButton');
  const datavisButton = document.getElementById('datavisButton');
  const designButton = document.getElementById('designButton');
  const dataartButton = document.getElementById('dataartButton');
  const homeButton = document.getElementById('homeButton');

  blogButton.addEventListener('click', () => {
    // Navigate to Blog Page
    window.location.href = 'blog.html';
  });

  datavisButton.addEventListener('click', () => {
    // Navigate to Data Visualization Page
    window.location.href = 'datavis.html';
  });

  designButton.addEventListener('click', () => {
    // Navigate to Design Page
    window.location.href = 'design.html';
  });

  dataartButton.addEventListener('click', () => {
    // Navigate to Data Art Page
    window.location.href = 'dataart.html';
  });

  homeButton.addEventListener('click', () => {
    // Navigate to Data Art Page
    window.location.href = 'index.html';
  });
  
});

document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.tile-button');

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const page = button.getAttribute('data-page');
      window.location.href = page;
    });
  });
});





const activePage = window.location.pathname;
const navButtons = document.querySelectorAll('nav button');

navButtons.forEach(button => {
  // Extract the page name from the button's ID
  const buttonPage = button.id.replace('Button', '');

  if (activePage.includes(buttonPage)) {
    button.classList.add('active');
  }
});

let prevScrollPos = window.pageYOffset;
const navbar = document.querySelector('nav');

window.addEventListener('scroll', () => {
  const currentScrollPos = window.pageYOffset;

  if (prevScrollPos > currentScrollPos) {
    // Scrolling up, show the navbar
    navbar.classList.remove('hidden');
  } else {
    // Scrolling down, hide the navbar
    navbar.classList.add('hidden');
  }

  prevScrollPos = currentScrollPos;
});

document.addEventListener('DOMContentLoaded', () => {
  const darkModeToggle = document.getElementById('darkModeToggle');
  const body = document.body;

  // Function to set a cookie
  function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/`;
  }

  // Function to get a cookie value by name
  function getCookie(name) {
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
      const [cookieName, cookieValue] = cookie.split('=');
      if (cookieName === name) {
        return cookieValue;
      }
    }
    return null;
  }

  // Check if dark mode is enabled using cookies
  const isDarkMode = getCookie('darkMode') === 'enabled';

  // Set initial dark mode state
  if (isDarkMode) {
    body.classList.add('dark-mode', 'transition');
    darkModeToggle.innerText = 'Light Mode';
  } else {
    body.classList.remove('dark-mode', 'transition');
    darkModeToggle.innerText = 'Dark Mode';
  }

  // Toggle dark mode on button click
  darkModeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const isEnabled = body.classList.contains('dark-mode');
    darkModeToggle.innerText = isEnabled ? 'Light Mode' : 'Dark Mode';

    // Add transition class to enable smooth transition
    body.classList.add('transition');

    // Store dark mode preference in a cookie
    setCookie('darkMode', isEnabled ? 'enabled' : 'disabled', 365); // Cookie will expire in 365 days

    // Remove transition class after the transition is complete
    setTimeout(() => {
      body.classList.remove('transition');
    }, 300); // Adjust the timeout to match your transition duration
  });

  // Remove transition class after the transition is complete
body.addEventListener('transitionend', () => {
  body.classList.remove('transition');
}, { once: true });

});

function changeDescriptor(text) {
  document.querySelector('.descriptor').textContent = text;
}



//DATA
function initExoplanetMap() {
  const width = 800;
  const height = 400;

  // Define the projection
  const projection = d3.geoOrthographic()
    .scale(width / 2)
    .translate([width / 2, height / 2]);

  const path = d3.geoPath().projection(projection);

  const svg = d3
    .select("#exoplanet-map")
    .append("svg")
    .attr("width", width)
    .attr("height", height);


  svg.append("path")
    .attr("class", "celestial-sphere")
    .attr("d", path({ type: "Sphere" }));

  // Data fetching from the NASA EPIC API
  fetch('https://epic.gsfc.nasa.gov/api/natural')
    .then(response => response.json())
    .then(data => {
      // Extract exoplanet data 
      const exoplanets = data.map(item => ({
        lat: item.centroid_coordinates.lat,
        lon: item.centroid_coordinates.lon,
        name: item.exoplanet_name,
        method: item.discovery_method,
        // Add more data attributes if needed
      }));

      // Append exoplanet markers
      const markers = svg.selectAll("circle")
        .data(exoplanets)
        .enter()
        .append("circle")
        .attr("cx", d => projection([d.lon, d.lat])[0])
        .attr("cy", d => projection([d.lon, d.lat])[1])
        .attr("r", 6) 
        .attr("class", "exoplanet-marker")
        .on("mouseover", showTooltip)
        .on("mouseout", hideTooltip)
        .on("click", showInfoPanel);

      
      markers.style("fill", d => (d.method === "Radial Velocity") ? "blue" : "red");

      
      svg.selectAll(".exoplanet-marker")
        .style("opacity", 0.8);

      // Zoom and pan functionality
      svg.call(d3.zoom()
        .scaleExtent([1, 10])
        .on("zoom", zoomed));

      function zoomed(event) {
        const { transform } = event;
        svg.attr("transform", transform);
      }

      // Tooltip functions
      function showTooltip(event, d) {
        const tooltip = d3.select("#tooltip");
        tooltip.html(`Name: ${d.name}<br>Discovery Method: ${d.method}`)
          .style("left", event.pageX + "px")
          .style("top", event.pageY + "px")
          .style("visibility", "visible");
      }

      function hideTooltip() {
        d3.select("#tooltip").style("visibility", "hidden");
      }

      function showInfoPanel(d) {
        function showInfoPanel(d) {
          const infoPanel = d3.select("#info-panel");
          infoPanel.html(`<h2>${d.name}</h2>
            
          `);
        
         
          infoPanel.style("visibility", "visible");
        }
        
        /
        document.addEventListener("click", function (event) {
          const infoPanel = d3.select("#info-panel");
          if (!infoPanel.node().contains(event.target)) {
            infoPanel.style("visibility", "hidden");
          }
        });
      }
    })
    .catch(error => console.error("Error fetching data:", error));
}

window.addEventListener("load", initExoplanetMap);


//ExoplanetSizeDistrubution
 
    const exoplanets = [
      
    ];

   
    const margin = { top: 20, right: 30, bottom: 40, left: 60 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

  
    const svg = d3
      .select("#chart-container")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    //
    const sizes = exoplanets.map((planet) => planet.size);

  
    const xScale = d3
      .scaleBand()
      .domain(exoplanets.map((planet) => planet.name))
      .range([0, width])
      .padding(0.1);

    
    const yScale = d3.scaleLinear().domain([0, d3.max(sizes)]).nice().range([height, 0]);


    svg
      .selectAll(".bar")
      .data(exoplanets)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (planet) => xScale(planet.name))
      .attr("y", (planet) => yScale(planet.size))
      .attr("width", xScale.bandwidth())
      .attr("height", (planet) => height - yScale(planet.size))
      .attr("fill", "steelblue");

    
    svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(xScale));

   
    svg
      .append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(yScale).ticks(5));

    
    svg
      .append("text")
      .attr("class", "x-label")
      .attr("x", width / 2)
      .attr("y", height + margin.top)
      .attr("text-anchor", "middle")
      .text("Exoplanet Name");

    svg
      .append("text")
      .attr("class", "y-label")
      .attr("x", -height / 2)
      .attr("y", -margin.left / 2)
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .text("Exoplanet Size");

