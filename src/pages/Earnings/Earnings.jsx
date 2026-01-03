import { useContext, useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { AuthContext } from '../../provider/AuthProvider';

const Earnings = () => {
  const { earningList } = useContext(AuthContext);
  const [yearlyEarnings, setYearlyEarnings] = useState([]);

  useEffect(() => {
    // Filter and sum earnings for each year across all properties
    const yearlySum = {};

    if (earningList) {
      earningList.forEach((property) => {
        if (property.earnings) {
          Object.entries(property.earnings).forEach(([year, amount]) => {
            yearlySum[year] = (yearlySum[year] || 0) + amount;
          });
        }
      });
    }

    // Convert the yearly sum into an array of objects
    const yearlyEarningsArray = Object.entries(yearlySum).map(([year, amount]) => ({
      year,
      "Amount Earned": amount,
    }));

    // Set the state with the calculated yearly earnings
    setYearlyEarnings(yearlyEarningsArray);
  }, [earningList]);

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10'>
      
      {/* Grid Layout: 1 Column Mobile, 2 Columns (2:1 ratio) on Large Screens */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Chart Section - Takes up 2 columns on desktop */}
        <div className="lg:col-span-2 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h3 className='text-xl md:text-2xl font-semibold uppercase text-center mb-6 text-gray-800'>
            Yearly Earnings <span className='font-bold text-primary'>Chart</span>
          </h3>
          
          <div className="h-[300px] sm:h-[400px] w-full">
            {yearlyEarnings.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={yearlyEarnings}
                  margin={{
                    top: 5,
                    right: 10,
                    left: 0,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="year" 
                    tick={{fontSize: 12}}
                    tickMargin={10}
                  />
                  <YAxis
                    tick={{fontSize: 12}}
                    tickFormatter={(value) =>
                      `$${value.toLocaleString(undefined, {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                        notation: "compact", 
                        compactDisplay: "short" 
                      })}`
                    }
                  />
                  <Tooltip 
                    cursor={{fill: 'transparent'}}
                    formatter={(value) => [`$${value.toLocaleString()}`, "Amount Earned"]}
                  />
                  <Legend wrapperStyle={{paddingTop: '20px'}}/>
                  <Bar 
                    dataKey="Amount Earned" 
                    fill="#8884d8" 
                    radius={[4, 4, 0, 0]} 
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                No data available
              </div>
            )}
          </div>
        </div>

        {/* Table Section - Takes up 1 column on desktop */}
        <div className="lg:col-span-1 bg-white p-4 rounded-xl shadow-sm border border-gray-100 h-fit">
          <h3 className='text-xl md:text-2xl font-semibold uppercase text-center mb-6 text-gray-800'>
            Yearly Earnings <span className='font-bold text-primary'>Table</span>
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="py-3 px-4 font-semibold text-gray-600 text-sm uppercase tracking-wider border-b border-gray-200">Year</th>
                  <th className="py-3 px-4 font-semibold text-gray-600 text-sm uppercase tracking-wider border-b border-gray-200 text-right">Earnings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {yearlyEarnings.map((entry) => (
                  <tr key={entry.year} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 text-gray-700 font-medium">{entry.year}</td>
                    <td className="py-3 px-4 text-gray-700 text-right font-mono">
                      ${entry["Amount Earned"].toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </td>
                  </tr>
                ))}
                {yearlyEarnings.length === 0 && (
                  <tr>
                     <td colSpan="2" className="py-4 text-center text-gray-500">No records found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Earnings;