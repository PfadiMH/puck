# /components/contexts

This directory houses React Context **Provider** components used in this project.

- [Official React Docs on Context](https://react.dev/learn/passing-data-deeply-with-context)

**Context Providers:**

- `SectionThemeProvider`: Provides theme data (colors, fonts) for sections of the application. This context should be used to ensure consistent styling across different sections. See `lib/section-theming.tsx` for details on the theme structure.

**Avoid:**

- Don't use a single, monolithic Context for all of your global state.
- If data only needs to be passed down one or two levels, passing props is often a simpler and more performant solution.
