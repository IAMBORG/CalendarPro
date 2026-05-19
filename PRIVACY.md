# Privacy Policy

**Last Updated:** May 18, 2026

## Overview

This Privacy Policy describes how the **Calendar Pro** Power BI custom visual
(the "Visual") handles data. This Visual is developed and distributed by
Chuck Nemeth.

We are committed to protecting your privacy. This Privacy Policy explains, in
plain language, what data the Visual processes and does not process.

## Summary

**The Calendar Pro Visual does not collect, store, or transmit any personal
information or data to any external service.** All processing happens locally
within the Power BI environment where the Visual is rendered.

## Data Processing

### Data Received

The Visual receives data only through the official Power BI host API, as
provided by the report it is added to. Specifically, the Visual receives:

- The date field bound by the report author to the Visual's "Date field" data
  role
- Formatting settings configured by the report author (theme color, fonts,
  date format preferences, granularity settings, etc.)
- Visual state previously persisted by Power BI (selected date ranges,
  expansion state, etc.)

The Visual does not receive any other information from the user's machine,
browser, or Power BI environment beyond what Power BI provides through its
documented host API.

### Data Stored Locally

The Visual uses Power BI's standard `persistProperties` API to store its own
configuration state (such as the currently selected date range) within the
Power BI report file. This information is stored by Power BI, not by the
Visual itself, and remains within the user's Power BI environment.

The Visual does not use cookies, `localStorage`, `sessionStorage`, IndexedDB,
or any other client-side persistence mechanism outside Power BI's standard
host APIs.

### Data Transmitted Externally

**The Visual does not transmit any data to any external server or service.**

The Visual contains no code that makes outbound network requests. Specifically:

- It does not use `fetch`, `XMLHttpRequest`, `WebSocket`, or any other
  network-request API
- It does not load resources from external URLs at runtime
- It does not send telemetry, analytics, crash reports, or any other data to
  the developer or any third party
- It does not phone home for license validation, version checks, or any other
  purpose

This compliance is verified during the Microsoft Power BI custom visual
certification process.

## Third-Party Libraries

The Visual is built using publicly available, open-source JavaScript libraries.
These libraries operate entirely within the Visual's sandboxed environment in
Power BI and do not transmit data externally. A complete list of dependencies
is available in the `package.json` file of the Visual's source code repository.

## Children's Privacy

The Visual is a tool for data visualization and is not directed at children
under the age of 13. It does not knowingly process information about children.

## Changes to This Privacy Policy

This Privacy Policy may be updated from time to time. The "Last Updated" date
at the top of this document reflects the most recent revision. Material
changes will be communicated through the Visual's repository on GitHub.

## Source Code

The source code for the Visual is publicly available at:
[https://github.com/IAMBORG/CalendarPro](https://github.com/IAMBORG/CalendarPro)

You are encouraged to review the source code to verify the statements made in
this Privacy Policy.

## Contact

For questions about this Privacy Policy, please contact:

- **Email:** chuck.nemeth@hotmail.com
- **GitHub Issues:** [https://github.com/IAMBORG/CalendarPro/issues](https://github.com/IAMBORG/CalendarPro/issues)

## Governing Considerations

The Visual operates within the Power BI environment provided by Microsoft.
Microsoft's own privacy practices and policies, including those governing
Power BI itself, apply to the Power BI service and report data. This Privacy
Policy covers only the Calendar Pro Visual itself.

Microsoft's privacy policy is available at:
[https://privacy.microsoft.com/en-us/privacystatement](https://privacy.microsoft.com/en-us/privacystatement)
