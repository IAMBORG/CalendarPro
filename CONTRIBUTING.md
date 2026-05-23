# Contributing to Calendar Pro

Thanks for your interest in contributing to Calendar Pro.

## Reporting issues

Use the [issue tracker](https://github.com/IAMBORG/CalendarPro/issues) to
report bugs, request features, or ask questions.

When filing a bug, please include:

- Power BI Desktop or Power BI Service version
- Calendar Pro version (visible in the visual's About dialog)
- Steps to reproduce
- Expected vs. actual behavior
- Screenshots if applicable

## Pull requests

Before submitting a pull request:

1. Fork the repository and create a feature branch.
2. Make your changes with clear commit messages.
3. Run `npm run eslint` and `npm run package` to confirm the build succeeds.
4. Submit a pull request describing the change and its motivation.

Pull requests are reviewed on a best-effort basis.

## Code style

- TypeScript with strict typing where practical.
- React components in `src/components/`.
- Visual settings in `src/vsettings.ts` (Power BI formatting model).
- Follow the existing ESLint configuration (`eslint-plugin-powerbi-visuals`).

## License

By contributing, you agree your work is licensed under the MIT License,
consistent with the rest of the project.
