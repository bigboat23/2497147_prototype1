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
// Fetch data from the NASA EPIC API and Display the coordinates of Camera
fetch('https://epic.gsfc.nasa.gov/api/natural')
  .then(response => response.json())
  .then(data => {
    // Extract latitude and longitude data
    const coordinates = data.map(item => ({
      lat: item.centroid_coordinates.lat,
      lon: item.centroid_coordinates.lon,
    }));

    // Create a scatter plot
    createScatterPlot(coordinates);
  })
 // .catch(error => console.error('Error fetching data:', error));

// Create a scatter plot using D3.js
function createScatterPlot(data) {
  const width = 800;
  const height = 400;
  const margin = { top: 20, right: 20, bottom: 30, left: 40 };

  // Create an SVG container
  const svg = d3.select('#scatter-plot')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  // Create scales for x and y axes
  const xScale = d3.scaleLinear()
    .domain([d3.min(data, d => d.lon), d3.max(data, d => d.lon)])
    .range([margin.left, width - margin.right]);

  const yScale = d3.scaleLinear()
    .domain([d3.min(data, d => d.lat), d3.max(data, d => d.lat)])
    .range([height - margin.bottom, margin.top]);

  // Reference the tooltip element
  const tooltip = document.getElementById('tooltip');
  const tooltipContent = document.getElementById('tooltip-content');

  // Create circles for each data point
  svg.selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('cx', d => xScale(d.lon))
    .attr('cy', d => yScale(d.lat))
    .attr('r', 4) // Radius of the circles
    .attr('class', 'circle') // Apply the circle class
    .on('mouseover', (event, d) => {
      // Show the tooltip
      tooltip.style.left = event.pageX + 'px';
      tooltip.style.top = event.pageY + 'px';
      tooltipContent.textContent = `Lat: ${d.lat}, Lon: ${d.lon}`;
      tooltip.classList.add('show');
    })
    .on('mouseout', () => {
      // Hide the tooltip
      tooltip.classList.remove('show');
    });

  // Create x and y axes
  svg.append('g')
    .attr('transform', `translate(0, ${height - margin.bottom})`)
    .call(d3.axisBottom(xScale))
    .attr('class', 'axis'); // Apply the axis class

  svg.append('g')
    .attr('transform', `translate(${margin.left}, 0)`)
    .call(d3.axisLeft(yScale))
    .attr('class', 'axis'); // Apply the axis class

  // Add labels for the axes
  svg.append('text')
    .attr('x', width / 2)
    .attr('y', height)
    .attr('text-anchor', 'middle');

  svg.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -height / 2)
    .attr('y', margin.left / 2)
    .attr('text-anchor', 'middle');
}
