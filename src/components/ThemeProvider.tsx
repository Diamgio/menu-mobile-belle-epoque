
"use client"

import React from 'react';

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeProviderContext = React.createContext<ThemeProviderState | undefined>(undefined)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "restaurant-menu-theme",
  ...props
}: ThemeProviderProps) {
  console.log("ThemeProvider initializing with React:", !!React);
  
  // This is where the error was occurring - ensure React is properly defined before using useState
  const [theme, setTheme] = React.useState<Theme>(() => {
    // Safe localStorage access with try-catch
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const storedTheme = window.localStorage.getItem(storageKey) as Theme
        return storedTheme || defaultTheme
      }
      return defaultTheme
    } catch (e) {
      console.error("Error accessing localStorage:", e)
      return defaultTheme
    }
  })

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    
    try {
      const root = window.document.documentElement

      root.classList.remove("light", "dark")

      if (theme === "system") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
        root.classList.add(systemTheme)
        return
      }

      root.classList.add(theme)
    } catch (e) {
      console.error("Error applying theme:", e)
    }
  }, [theme])

  const value = React.useMemo(
    () => ({
      theme,
      setTheme: (theme: Theme) => {
        try {
          if (typeof window !== "undefined" && window.localStorage) {
            window.localStorage.setItem(storageKey, theme);
          }
          setTheme(theme);
        } catch (e) {
          console.error("Error setting theme:", e);
          setTheme(theme);
        }
      },
    }),
    [theme, storageKey]
  )

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = (): ThemeProviderState => {
  const context = React.useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
