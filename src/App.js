import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
import { saveAs } from 'file-saver';

// Function to render the Method Detail page
function MethodDetail() {
  // Get the method ID from the URL
  const { id } = useParams();
  // Initialize the state to store the method details
  const [methodDetails, setMethodDetails] = useState(null);

  // Fetch the method details from the API
  useEffect(() => {
    fetch(`/ldmethods/${id}`)
      .then((res) => res.json())
      .then((data) => {
        // Set the method details state
        setMethodDetails(data);
        // Log the data to the console
        console.log(data);
      });
  }, [id]);

  // Function to save the method details to a file
  const handleSaveToFile = () => {
    // Convert the method details to a string
    const jsonData = JSON.stringify(methodDetails, null, 2);
    // Create a blob object with the data
    const blob = new Blob([jsonData], { type: 'application/json' });
    // Save the file to the local machine
    saveAs(blob, `method_${id}_details.json`);
  };

  // Return the component
  return (
    <div>
      <h2>Method Detail</h2>
      {methodDetails ? (
        <div>
          <p>Method ID: {methodDetails[0].method.id}</p>
          <p>Method Name: {methodDetails[0].method.method_name}</p>
          <h3>Yearly Details:</h3>
          <table>
            <thead>
              <tr>
                <th>Year</th>
                <th>Estimated Ultimate Loss ($000)</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(JSON.parse(methodDetails[1])).map(([year, details]) => (
                <tr key={year}>
                  <td>{year}</td>
                  <td>{details['Estimated Ultimate Loss ($000)']}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleSaveToFile}>Save to File</button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}


// Function to render the Home page
function Home({ data }) {
  // Function to save the data to a file
  const handleSaveToFile = () => {
    // Convert the data to a string
    const jsonData = JSON.stringify(data, null, 2);
    // Create a blob object with the data
    const blob = new Blob([jsonData], { type: 'application/json' });
    // Save the file to the local machine
    saveAs(blob, 'data.json');
  };

  // Return the component
  return (
    <div>
      {typeof data === 'undefined' ? (
        <p>Loading...</p>
      ) : (
        <div>
          <button onClick={handleSaveToFile}>Save to File</button>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Method Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((method, i) => (
                <tr key={i}>
                  <td>{method.id}</td>
                  <td>{method.method_name}</td>
                  <td>
                    <Link to={`/ldmethods/${method.id}`}>View Details</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Function to render the App component
function App() {
  // Initialize the state to store the data
  const [data, setData] = useState({ methods: [] });

  // Fetch the data from the API
  useEffect(() => {
    fetch("/ldmethods")
      .then((res) => res.json())
      .then((data) => {
        // Set the data state
        setData(data);
        // Log the data to the console
        console.log(data);
      });
  }, []);

  // Return the component
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home data={data.methods} />} />
          <Route path="/ldmethods/:id" element={<MethodDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

// Export the App component
export default App;