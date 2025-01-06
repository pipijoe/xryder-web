/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
  	extend: {
		typography: {
			DEFAULT: {
				css: {
					color: '#333',
					a: {
						color: '#1d4ed8',
						'&:hover': {
							color: '#2563eb',
						},
					},
					code: {
						backgroundColor: '#f3f4f6',
						padding: '0.2em 0.4em',
						borderRadius: '4px',
					},
					hr: {
						borderColor: '#e5e7eb', // 设置分割线颜色
						borderWidth: '1px', // 设置分割线宽度
						marginTop: '1.5em', // 分割线顶部间距
						marginBottom: '1.5em', // 分割线底部间距
					},
				},
			},
			dark: {
				css: {
					color: '#f9fafb', // 设置暗黑模式下的文本颜色
					a: {
						color: '#93c5fd',
						'&:hover': {
							color: '#60a5fa',
						},
					},
					blockquote: {
						color: '#9ca3af',
						borderLeftColor: '#4b5563',
					},
					code: {
						// backgroundColor: '#1f2937',
						color: '#f3f4f6',
					},
					h1: { color: '#f9fafb' },
					h2: { color: '#f9fafb' },
					h3: { color: '#f9fafb' },
					p: { color: '#f9fafb' },
					strong: { color: '#f9fafb' },
					li: { color: '#f9fafb' },
					ol: { color: '#f9fafb' },
					hr: {
						borderColor: '#374151', // 暗黑模式下的分割线颜色
						borderWidth: '1px',
						marginTop: '1.5em',
						marginBottom: '1.5em',
					},
				},
			},
		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
			sidebar: {
				DEFAULT: 'hsl(var(--sidebar-background))',
				foreground: 'hsl(var(--sidebar-foreground))',
				primary: 'hsl(var(--sidebar-primary))',
				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
				accent: 'hsl(var(--sidebar-accent))',
				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
				border: 'hsl(var(--sidebar-border))',
				ring: 'hsl(var(--sidebar-ring))',
			},
  		},
		keyframes: {
			'accordion-down': {
				from: {
					height: '0'
				},
				to: {
					height: 'var(--radix-accordion-content-height)'
				}
			},
			'accordion-up': {
				from: {
					height: 'var(--radix-accordion-content-height)'
				},
				to: {
					height: '0'
				}
			},
			'fade-up': {
				'0%': { opacity: 0, transform: 'translateY(20px)' },
				'100%': { opacity: 1, transform: 'translateY(0)' },
			},
			'fade-in': {
				'0%': { opacity: 0 },
				'100%': { opacity: 1 },
			},
			ripple: {
				'0%, 100%': {
					transform: 'translate(-50%, -50%) scale(1)'
				},
				'50%': {
					transform: 'translate(-50%, -50%) scale(0.9)'
				}
			},
		},
		animation: {
			ripple: 'ripple var(--duration,2s) ease calc(var(--i, 0)*.2s) infinite',
			'accordion-down': 'accordion-down 0.2s ease-out',
			'accordion-up': 'accordion-up 0.2s ease-out',
			'fade-up': 'fade-up 0.7s ease-out',
			'fade-in': 'fade-in 1s ease-out forwards',
		}
  	}
  },
  plugins: [require("tailwindcss-animate"), require('@tailwindcss/typography')],
}

