import { fireEvent, render } from "@testing-library/react"
import Pomodoro from "../src/components/Pomodoro/Pomodoro"
import '@testing-library/jest-dom'
import userEvent from "@testing-library/user-event"
import { act } from "react"
import { vi } from "vitest"

describe("<Pomodoro />", () => {

  // Function to set clock config with the provided values
  const setClockConfig = (
    getByTestIdFunc: (id: string) => HTMLElement,
    focus_time: number,
    break_time: number,
    rest_time: number,
  ) => {
    fireEvent.click(getByTestIdFunc("show-clock-config"))

    const focusInput = getByTestIdFunc("focus_time-input")
    fireEvent.focus(focusInput)
    fireEvent.change(focusInput, { target: { value: '' } })
    fireEvent.change(focusInput, { target: { value: `${focus_time}` } })

    const breakInput = getByTestIdFunc("break_time-input")
    fireEvent.focus(breakInput)
    fireEvent.change(breakInput, { target: { value: '' } })
    fireEvent.change(breakInput, { target: { value: `${break_time}` } })

    const restInput = getByTestIdFunc("rest_time-input")
    fireEvent.focus(restInput)
    fireEvent.change(restInput, { target: { value: '' } })
    fireEvent.change(restInput, { target: { value: `${rest_time}` } })
  }

  it('renders', () => {
    const { getByTestId } = render(<Pomodoro />)
    expect(getByTestId("pomodoro")).toBeInTheDocument()
    expect(getByTestId("clock")).toBeInTheDocument()
    expect(getByTestId("timer-state")).toBeInTheDocument()
    expect(getByTestId("clock-buttons")).toBeInTheDocument()
  }) 

  it('toggle clock config', async () => {
    const { getByTestId, queryByTestId } = render(<Pomodoro />)

    await userEvent.click(getByTestId("show-clock-config"))
    expect(getByTestId("clock-config")).toBeInTheDocument()

    await userEvent.click(getByTestId("show-clock-config"))
    expect(queryByTestId("clock-config")).not.toBeInTheDocument()
  })

  it('config clock', async () => {
    const { getByTestId } = render(<Pomodoro />)
    
    // Open config
    await userEvent.click(getByTestId("show-clock-config"))
    
    // Set focus, break and rest times
    await userEvent.click(getByTestId("focus_time-input"))
    await userEvent.keyboard('{Control>}[KeyA]{/Control}{Backspace}');
    await userEvent.type(getByTestId("focus_time-input"), "25.5")

    await userEvent.click(getByTestId("break_time-input"))
    await userEvent.keyboard('{Control>}[KeyA]{/Control}{Backspace}');
    await userEvent.type(getByTestId("break_time-input"), "5")

    await userEvent.click(getByTestId("rest_time-input"))
    await userEvent.keyboard('{Control>}[KeyA]{/Control}{Backspace}');
    await userEvent.type(getByTestId("rest_time-input"), "15")

    // Check if config is correct
    expect(getByTestId("clock-minutes")).toHaveTextContent("25")
    expect(getByTestId("clock-seconds")).toHaveTextContent("30")
  })

  it('start and stop clock', async () => {
    const { getByTestId } = render(<Pomodoro />)

    // Check if start button is present and click it
    expect(getByTestId("clock-buttons")).toHaveTextContent("Iniciar")

    // Start clock and check if button changes to pause
    await userEvent.click(getByTestId("start-clock-button"))
    expect(getByTestId("clock-buttons")).toHaveTextContent("Pausar")

    // Stop clock and check if button changes to continue and restart
    await userEvent.click(getByTestId("stop-clock-button"))
    expect(getByTestId("clock-buttons").textContent).toContain("Continuar")
    expect(getByTestId("clock-buttons").textContent).toContain("Recomeçar")
  })
  
  it('Should run and reset clock', () => {
    vi.useFakeTimers()

    const { getByTestId } = render(<Pomodoro />)
    const minutes = getByTestId('clock-minutes')
    const seconds = getByTestId('clock-seconds')

    // Set clock config
    setClockConfig(getByTestId, 30.25, 10, 15)

    expect(minutes).toHaveTextContent('30')
    expect(seconds).toHaveTextContent('15')

    // Start clock
    fireEvent.click(getByTestId('start-clock-button'))

    // Wait for 27 minutes
    act(() => {
      vi.advanceTimersByTime(27 * 60 * 1000)
    })

    // Check if the time has passed
    expect(minutes).toHaveTextContent('03')
    expect(seconds).toHaveTextContent('15')

    // Stop clock
    fireEvent.click(getByTestId('stop-clock-button'))

    // Wait for 1 hour
    act(() => {
      vi.advanceTimersByTime(60 * 60 * 1000)
    })

    // Check if the time has not changed
    expect(minutes).toHaveTextContent('03')
    expect(seconds).toHaveTextContent('15') 

    // Reset clock
    fireEvent.click(getByTestId('reset-clock-button'))

    // Check if the time has reset
    expect(minutes).toHaveTextContent('30')
    expect(seconds).toHaveTextContent('15')

    vi.useRealTimers()
  })

  it('Should run the focus, break, and rest cycles correctly', () => {
    // Use fake timers for controlling time in the test
    vi.useFakeTimers()

    // Render the Pomodoro component and get relevant elements
    const { getByTestId } = render(<Pomodoro />)
    const minutes = getByTestId('clock-minutes')
    const seconds = getByTestId('clock-seconds')
    const focusState = getByTestId('focus-state')
    const breakState = getByTestId('break-state')
    const restState = getByTestId('rest-state')

    // Set clock configuration: focus=30 min, break=10 min, rest=15 min
    setClockConfig(getByTestId, 30, 10, 15)

    // Start the clock
    fireEvent.click(getByTestId('start-clock-button'))

    // Advance time by 1 second to trigger the start
    act(() => {
      vi.advanceTimersByTime(1000)
    })

    // Verify that focus state is active at start
    expect(focusState).toHaveClass('text_activated')
    expect(breakState).not.toHaveClass('text_activated')
    expect(restState).not.toHaveClass('text_activated')

    // Simulate 30 minutes passing (focus period ends)
    act(() => {
      vi.advanceTimersByTime(30 * 60 * 1000)
    })

    // Expect timer to reach 00:00
    expect(minutes).toHaveTextContent('00')
    expect(seconds).toHaveTextContent('00')

    // All states should be inactive before continuing
    expect(focusState).not.toHaveClass('text_activated')
    expect(breakState).not.toHaveClass('text_activated')
    expect(restState).not.toHaveClass('text_activated')

    // Continue to next cycle (break)
    fireEvent.click(getByTestId('continue-clock-button'))

    // Advance 1 second to start break period
    act(() => {
      vi.advanceTimersByTime(1000)
    })

    // Break state should be active now
    expect(focusState).not.toHaveClass('text_activated')
    expect(breakState).toHaveClass('text_activated')
    expect(restState).not.toHaveClass('text_activated')

    // Simulate 10 minutes passing (break period ends)
    act(() => {
      vi.advanceTimersByTime(10 * 60 * 1000)
    })

    // Timer should be 00:00 again
    expect(minutes).toHaveTextContent('00')
    expect(seconds).toHaveTextContent('00')

    // All states inactive before continuing
    expect(focusState).not.toHaveClass('text_activated')
    expect(breakState).not.toHaveClass('text_activated')
    expect(restState).not.toHaveClass('text_activated')

    // Continue to next cycle (focus again)
    fireEvent.click(getByTestId('continue-clock-button'))

    // Advance 1 second to start focus period again
    act(() => {
      vi.advanceTimersByTime(1000)
    })

    // Focus state active, others inactive
    expect(focusState).toHaveClass('text_activated')
    expect(breakState).not.toHaveClass('text_activated')
    expect(restState).not.toHaveClass('text_activated')

    // Simulate another 30 minutes passing (focus ends)
    act(() => {
      vi.advanceTimersByTime(30 * 60 * 1000)
    })

    // Timer at 00:00
    expect(minutes).toHaveTextContent('00')
    expect(seconds).toHaveTextContent('00')

    // All states inactive before next cycle
    expect(focusState).not.toHaveClass('text_activated')
    expect(breakState).not.toHaveClass('text_activated')
    expect(restState).not.toHaveClass('text_activated')

    // Continue to rest cycle
    fireEvent.click(getByTestId('continue-clock-button'))

    // Advance 1 second to start rest period
    act(() => {
      vi.advanceTimersByTime(1000)
    })

    // Rest state should be active now
    expect(focusState).not.toHaveClass('text_activated')
    expect(breakState).not.toHaveClass('text_activated')
    expect(restState).toHaveClass('text_activated')

    // Simulate 15 minutes passing (rest ends)
    act(() => {
      vi.advanceTimersByTime(15 * 60 * 1000)
    })

    // After rest, timer resets to initial focus time (30:00)
    expect(minutes).toHaveTextContent('30')
    expect(seconds).toHaveTextContent('00')

    // All states inactive after rest
    expect(focusState).not.toHaveClass('text_activated')
    expect(breakState).not.toHaveClass('text_activated')
    expect(restState).not.toHaveClass('text_activated')
  })
})