import { useEffect, useMemo, useRef, useState } from "react"
import { Search, CircleDot } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const SUGGESTIONS = [
  "Pikachu",
  "Charizard",
  "Umbreon",
  "Zekrom",
  "Mewtwo",
  "Gengar",
  "Rayquaza",
  "Greninja",
  "Eevee",
]

function GooeyFilter() {
  return (
    <svg style={{ position: "absolute", width: 0, height: 0 }} aria-hidden="true">
      <defs>
        <filter id="gooey-effect">
          <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -8"
            result="goo"
          />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </defs>
    </svg>
  )
}

export default function SearchBar({
  placeholder = "Search Pokémon cards...",
  value,
  onChange,
  onSearch,
}) {
  const inputRef = useRef(null)
  const [isFocused, setIsFocused] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [isClicked, setIsClicked] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const isUnsupportedBrowser = useMemo(() => {
    if (typeof window === "undefined") return false
    const ua = navigator.userAgent.toLowerCase()
    const isSafari = ua.includes("safari") && !ua.includes("chrome") && !ua.includes("chromium")
    const isChromeOniOS = ua.includes("crios")
    return isSafari || isChromeOniOS
  }, [])

  useEffect(() => {
    const q = String(value || "").trim()
    if (!q) {
      setSuggestions([])
      return
    }

    const filtered = SUGGESTIONS.filter((item) =>
      item.toLowerCase().includes(q.toLowerCase())
    )
    setSuggestions(filtered)
  }, [value])

  useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isFocused])

  const handleSubmit = (e) => {
    e.preventDefault()
    const q = String(value || "").trim()
    if (!q) return

    onSearch?.(q)
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 700)
  }

  const handleMouseMove = (e) => {
    if (!isFocused) return
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
    setIsClicked(true)
    setTimeout(() => setIsClicked(false), 700)
  }

  const particles = Array.from({ length: isFocused ? 14 : 0 }, (_, i) => (
    <motion.div
      key={i}
      initial={{ scale: 0 }}
      animate={{
        x: [0, (Math.random() - 0.5) * 36],
        y: [0, (Math.random() - 0.5) * 36],
        scale: [0, Math.random() * 0.8 + 0.4],
        opacity: [0, 0.7, 0],
      }}
      transition={{
        duration: Math.random() * 1.5 + 1.2,
        ease: "easeInOut",
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
      }}
      className="searchbar-particle"
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      }}
    />
  ))

  const clickParticles = isClicked
    ? Array.from({ length: 12 }, (_, i) => (
        <motion.div
          key={`click-${i}`}
          initial={{ x: mousePosition.x, y: mousePosition.y, scale: 0, opacity: 1 }}
          animate={{
            x: mousePosition.x + (Math.random() - 0.5) * 140,
            y: mousePosition.y + (Math.random() - 0.5) * 140,
            scale: Math.random() * 0.8 + 0.2,
            opacity: [1, 0],
          }}
          transition={{ duration: Math.random() * 0.7 + 0.45, ease: "easeOut" }}
          className="searchbar-click-particle"
        />
      ))
    : null

  return (
    <div className="searchbar-shell">
      <GooeyFilter />

      <motion.form
        onSubmit={handleSubmit}
        className="searchbar-form"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        onMouseMove={handleMouseMove}
      >
        <motion.div
          className={`searchbar-frame ${isFocused ? "is-focused" : ""}`}
          animate={{
            scale: isFocused ? 1.01 : 1,
            boxShadow: isClicked
              ? "0 0 40px rgba(139, 92, 246, 0.18), 0 0 15px rgba(236, 72, 153, 0.18) inset"
              : isFocused
              ? "0 18px 40px rgba(0, 0, 0, 0.28)"
              : "0 14px 38px rgba(0, 0, 0, 0.22)",
          }}
          onClick={handleClick}
        >
          {isFocused && (
            <motion.div
              className="searchbar-gradient"
              initial={{ opacity: 0 }}
              animate={{
                opacity: 0.14,
                background: [
                  "linear-gradient(90deg, #f6d365 0%, #fda085 100%)",
                  "linear-gradient(90deg, #a1c4fd 0%, #c2e9fb 100%)",
                  "linear-gradient(90deg, #d4fc79 0%, #96e6a1 100%)",
                  "linear-gradient(90deg, #f6d365 0%, #fda085 100%)",
                ],
              }}
              transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            />
          )}

          <div
            className="searchbar-particles-wrap"
            style={{ filter: isUnsupportedBrowser ? "none" : "url(#gooey-effect)" }}
          >
            {particles}
          </div>

          {isClicked && (
            <>
              <motion.div
                className="searchbar-ripple"
                initial={{ scale: 0, opacity: 0.6 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
              {clickParticles}
            </>
          )}

          <motion.div
            className="searchbar-icon-wrap"
            animate={{
              rotate: isAnimating ? [0, -15, 15, -10, 10, 0] : 0,
              scale: isAnimating ? [1, 1.2, 1] : 1,
            }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <Search
              size={18}
              className={`searchbar-icon ${isFocused ? "is-focused" : ""}`}
            />
          </motion.div>

          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 140)}
            className="searchbar-input"
          />

          <AnimatePresence>
            {String(value || "").trim() && (
              <motion.button
                type="submit"
                initial={{ opacity: 0, scale: 0.85, x: -12 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.85, x: -12 }}
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 10px 25px -5px rgba(139, 92, 246, 0.35)",
                }}
                whileTap={{ scale: 0.96 }}
                className="searchbar-submit"
              >
                Search
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.form>

      <AnimatePresence>
        {isFocused && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: 10, height: 0 }}
            transition={{ duration: 0.18 }}
            className="searchbar-suggestions"
          >
            <div className="searchbar-suggestions-inner">
              {suggestions.map((suggestion, index) => (
                <motion.button
                  key={suggestion}
                  type="button"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ delay: index * 0.04 }}
                  onClick={() => {
                    onChange?.(suggestion)
                    onSearch?.(suggestion)
                    setIsFocused(false)
                  }}
                  className="searchbar-suggestion"
                >
                  <CircleDot size={15} className="searchbar-suggestion-dot" />
                  <span>{suggestion}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}