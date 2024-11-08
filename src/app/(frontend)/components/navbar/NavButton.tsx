type Props = {
  icon: React.ReactNode
  text: string
  onClick: () => void
  variant?: 'primary' | 'danger'
}

export default function NavButton({ icon, text, onClick, variant = 'primary' }: Props) {
  const baseStyle = "inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:shadow-md"
  const variants = {
    primary: "text-orange-600 bg-white hover:bg-orange-50",
    danger: "text-white bg-red-500 hover:bg-red-600"
  }

  return (
    <button
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]}`}
    >
      {icon}
      <span className="ml-2">{text}</span>
    </button>
  )
}