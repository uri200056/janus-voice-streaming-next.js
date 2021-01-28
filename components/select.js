import { memo, useEffect, useRef, useState } from "react"
import ChevronDown from "@icons/ChevronDown"
import clsx from "clsx"

const Option = ({ value, onClick, isActive, isLast }) => (
	<span
		onClick={onClick}
		className={clsx("w-full p-2 text-accent-text", {
			"bg-secondary-100 hover:bg-primary-300": !isActive,
			"bg-primary-200": isActive,
			"rounded-b-md": isLast,
		})}
	>
		{value}
	</span>
)

const OptionList = ({ className, active, values, onClick }) => (
	<div className={clsx(className, "flex flex-col")}>
		{values.map((value, index) => (
			<Option
				key={value}
				value={value}
				onClick={onClick}
				isActive={active === value}
				isLast={index === values.length - 1}
			/>
		))}
	</div>
)

const Select = memo(({ className, values }) => {
	const [open, setOpen] = useState(false)
	const [active, setActive] = useState(values[0])
	const selector = useRef()

	useEffect(() => {
		// Update the active value to be the first element
		// in the values array whenever the active value
		// is an empty string
		if (active && active.trim() !== "") {
			return
		}

		setActive(values[0])
	}, [values])

	const handleClickAway = event => {
		if (
			!selector ||
			!selector.current ||
			selector.current.contains(event.target) ||
			selector.current === event.target
		) {
			return
		}

		// Close selector
		// Remove event listener
		setOpen(false)
		document.removeEventListener("mousedown", handleClickAway)
	}

	const handleOpen = event => {
		event.preventDefault()

		if (open) {
			return
		}

		// Set selector to open
		// Add click away listener
		setOpen(true)
		document.addEventListener("mousedown", handleClickAway)
	}

	const handleOptionSelect = event => {
		event.preventDefault()

		// Change active value
		// Close selector
		setActive(event.target.innerText)
		setOpen(false)
	}

	return (
		<div className={clsx(className, "relative cursor-default")} ref={selector} onClick={handleOpen}>
			<div
				className={clsx(
					"p-2 flex items-center justify-between border-2 border-solid border-secondary-100 bg-secondary-100 text-accent-text",
					{
						"rounded-md hover:border-accent-text": !open,
						"rounded-t-md border-b-0 border-accent-text shadow-md": open,
					},
				)}
			>
				<span className="truncate">{active}</span>
				<ChevronDown className="w-6 h-6 cursor-pointer transition-opacity duration-150 opacity-50 hover:opacity-100" />
			</div>
			<OptionList
				className={clsx(
					"absolute border-l-2 border-r-2 border-b-2 rounded-b-md border-accent-text w-full overflow-hidden z-10",
					{
						"max-h-0 border-opacity-0": !open,
						"max-h-screen shadow-md": open,
					},
				)}
				values={values}
				active={active}
				onClick={handleOptionSelect}
			/>
		</div>
	)
})

export default Select
