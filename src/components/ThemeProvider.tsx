
"use client"

import * as React from "react"

// Explicitly import useState and useContext to ensure they're available
const { useState, useEffect, createContext, useContext, useMemo } = React;

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

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "restaurant-menu-theme",
  ...props
}: ThemeProviderProps) {
  // Initialize with explicit React hook reference
  const [theme, setTheme] = useState<Theme>(() => {
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

  // Handle theme class application safely with explicit useEffect
  useEffect(() => {
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

  // Create context value with explicit useMemo
  const value = useMemo(
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
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
