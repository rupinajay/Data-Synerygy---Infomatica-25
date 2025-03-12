# Data Synergy

A powerful AI-powered business intelligence dashboard that allows you to query and analyze business data using natural language.

## Features

- **Natural Language Querying**: Ask questions about your business data in plain English
- **AI-Powered Insights**: Automatically generates insights from your connected data sources
- **Interactive Visualizations**: View your data through dynamic charts and graphs
- **Multiple Data Sources**: Connect to Snowflake, Salesforce, and other data platforms
- **Responsive Design**: Works on desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or Yarn

### Installation

1. Clone the repository:
```sh
git clone <your-repo-url>
cd business-intelligence-dashboard
```

2. Install the dependencies:
```sh
npm install
# or
yarn install
```

3. Set up environment variables:
   - Create a `.env` file in the root directory
   - Add your API keys:
```
GROQ_API_KEY=your_groq_api_key
```

4. Start the development server:
```sh
npm run dev
# or
yarn dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Usage

### Querying Data

1. Navigate to the Insights page
2. Type your business query in the search box (e.g., "Show revenue data for GenePoint account")
3. View the results in both natural language and raw data format

### Example Queries

- "Show account number, industry type, revenue, and billing address for GenePoint account"
- "Return all data related to sForce account"
- "What are the growth opportunities for our accounts?"

### Exploring Insights

The dashboard automatically generates insights based on your data. These insights are categorized into:

- Sales insights
- Product insights 
- Customer insights

Click on each insight card to view more details and recommended actions.

## Architecture

The application is built with:

- React
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Recharts for data visualization
- React Query for data fetching

The backend integration uses:
- Informatica API for data processing
- Groq LLM for natural language generation

## Customization

### Connecting Your Own Data Sources

1. Navigate to the Data Sources page
2. Click "Add New Data Source"
3. Follow the connection wizard to authenticate with your data platform
4. Once connected, your data will be available for querying

### Theming

The application comes with a dark theme by default. You can customize the theme by:

1. Navigating to the Settings page
2. Selecting the Appearance tab
3. Choosing between dark, light, or system theme

## Troubleshooting

### API Connection Issues

If you encounter issues connecting to the Informatica API:

1. Check that your credentials are correct
2. Ensure your network allows the connection
3. The application will automatically fall back to the internal processing engine

### Performance Optimization

For large datasets:
- Use more specific queries
- Filter data by date ranges when possible
- Consider upgrading your API plan for higher rate limits

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
