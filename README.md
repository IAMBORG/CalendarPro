# Calendar Pro for Power BI

A Power BI custom visual for selecting date ranges with multiple granularities
(day, week, pay period, month, quarter, year) and preset ranges (today, last
week, this month, year-to-date, etc.).

Forked from [o221/dateSelector](https://github.com/o221/dateSelector) by Tambla (MIT).
Substantially rewritten and extended for AppSource certification.

## Features

- Multiple granularity step controls: day, week, pay period, month, quarter, year
- Preset date ranges: today, yesterday, this/last week, this/last month, this/last
  quarter, this/last year, year-to-today, year-to-date variants, year-to-end-of-
  last-month, and more
- Configurable week start day, year start month, and pay-period reference
- Customizable date display formats
- Light and dark theme modes
- Synchronizes filter state with other Power BI visuals
- Supports bookmarks and persisted filter state

## Installation

### From Microsoft Marketplace

Install directly from the Microsoft Marketplace listing:

[https://marketplace.microsoft.com/en-us/product/power-bi-visuals/chucknemeth.calendar-pro-pbi](https://marketplace.microsoft.com/en-us/product/power-bi-visuals/chucknemeth.calendar-pro-pbi)

Alternatively, in Power BI Desktop, open the **Visualizations** pane, click
the ellipsis, choose **Get more visuals**, and search for "Calendar Pro Plus".

### From a .pbiviz file

1. Download the latest `.pbiviz` from the [Releases page](https://github.com/IAMBORG/CalendarPro/releases).
2. In Power BI Desktop, open the **Visualizations** pane, click the ellipsis,
   choose **Import a visual from a file**, and select the downloaded `.pbiviz`.

## Build from source

Prerequisites:

- Node.js 18 or newer
- npm
- [powerbi-visuals-tools](https://www.npmjs.com/package/powerbi-visuals-tools)
  (installed as a project dependency)

Build steps:

```
git clone https://github.com/IAMBORG/CalendarPro.git
cd CalendarPro
npm install
npm run package
```

The compiled `.pbiviz` is written to the `dist/` folder.

## Development

To start a local development server with hot reload:

```
npm start
```

Then enable the developer visual in Power BI Service or Power BI Desktop and add
it to a report.

## Lint

```
npm run eslint
```

## Repository

[https://github.com/IAMBORG/CalendarPro](https://github.com/IAMBORG/CalendarPro)

## License

MIT — see [LICENSE](./LICENSE).
