'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'matrix' | 'cyberpunk' | 'classic' | 'dim';

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    accentColor: string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeEngine = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useThemeEngine must be used within a ThemeProvider');
    return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>('matrix');

    const themes = {
        matrix: { accent: '#00ff41', bg: '#000000', secondary: '#003b00' },
        cyberpunk: { accent: '#fcee0a', bg: '#0a0a0a', secondary: '#ff003c' },
        classic: { accent: '#6366f1', bg: '#0f172a', secondary: '#1e293b' },
        dim: { accent: '#94a3b8', bg: '#020617', secondary: '#0f172a' }
    };

    useEffect(() => {
        // Apply CSS variables to root
        const root = document.documentElement;
        const colors = themes[theme];
        root.style.setProperty('--ecosystem-accent', colors.accent);
        root.style.setProperty('--ecosystem-bg', colors.bg);
        root.style.setProperty('--ecosystem-secondary', colors.secondary);

        // Smooth transition class
        root.classList.add('theme-transitioning');
        const timer = setTimeout(() => root.classList.remove('theme-transitioning'), 500);
        return () => clearTimeout(timer);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme, accentColor: themes[theme].accent }}>
            <div className={`theme-${theme} min-h-screen transition-colors duration-500`}>
                {children}
            </div>
        </ThemeContext.Provider>
    );
};

export default function ThemeSwitcher() {
    const { theme, setTheme } = useThemeEngine();

    return (
        <div className="fixed bottom-6 right-6 flex gap-2 p-2 bg-black/80 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl z-50">
            {(['matrix', 'cyberpunk', 'classic', 'dim'] as Theme[]).map((t) => (
                <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${theme === t ? 'border-white scale-125' : 'border-transparent'
                        } ${t === 'matrix' ? 'bg-[#00ff41]' :
                            t === 'cyberpunk' ? 'bg-[#fcee0a]' :
                                t === 'classic' ? 'bg-[#6366f1]' : 'bg-[#94a3b8]'
                        }`}
                    title={`Switch to ${t} theme`}
                />
            ))}
        </div>
    );
}
