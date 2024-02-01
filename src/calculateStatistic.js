const fs = require('fs'); 
async function calculateStatistics() { 
    try { 
        // Read heart rate data from JSON file 
        const rawData = await fs.promises.readFile('./testdata/heartrate.json'); 
        const heartRateData = JSON.parse(rawData); 

        // Create a map to store aggregated measurements for each day 
        const aggregatedData = new Map(); 

        // Aggregate measurements for each days
        heartRateData.forEach(measurement => { const date = measurement.timestamps.startTime.substring(0, 10); 
            if (!aggregatedData.has(date)) {
                 aggregatedData.set(date, { beatsPerMinute: [], }); 
           } 
           aggregatedData.get(date).beatsPerMinute.push(measurement.beatsPerMinute); 
        });

         // Calculate statistics for each day 
         const result = Array.from(aggregatedData.entries()).map(([date, data]) => {
             const beatsPerMinute = data.beatsPerMinute; 
             const min = Math.min(...beatsPerMinute); 
             const max = Math.max(...beatsPerMinute); 
             const median = calculateMedian(beatsPerMinute); 

        // Find the latest data timestamp 
             const latestDataTimestamp = heartRateData .filter(measurement => measurement.timestamps.startTime.substring(0, 10) === date) .map(measurement => measurement.timestamps.endTime) .pop(); 
             return { date, min, max, median, latestDataTimestamp, };
             });
                   
        // Write the result to output JSON file 
              await fs.promises.writeFile('output.json', JSON.stringify(result, null, 2)); 
              console.log('Statistics calculated and written to output.json'); 
            } catch (error) { 
                console.error('Error:', error.message); 
            } 
        } 

        // Function to calculate median 
        function calculateMedian(arr) { 
            const sortedArr = arr.slice().sort((a, b) => a - b); 
            const middle = Math.floor(sortedArr.length / 2);
             if (sortedArr.length % 2 === 0) { 
                return (sortedArr[middle - 1] + sortedArr[middle]) / 2; 
            } else { 
                return sortedArr[middle]; 
            } 
        }
       calculateStatistics();
