import { useState } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Button } from "./Button";
import { Dialog } from "./Dialog";
import { Slider } from "./Slider";
import { TextField } from "./TextField";

describe("UI primitives", () => {
  it("связывает labels, hints и ошибки с нативными controls", () => {
    render(
      <>
        <TextField
          error="Укажите место"
          hint="Например, Огород"
          label="Локация"
        />
        <Slider
          defaultValue="8"
          label="Интенсивность"
          max="10"
          min="1"
          valueText="8 из 10"
        />
      </>,
    );

    expect(screen.getByRole("textbox", { name: "Локация" })).toHaveAccessibleDescription(
      "Например, Огород Укажите место",
    );
    expect(
      screen.getByRole("slider", { name: "Интенсивность" }),
    ).toHaveValue("8");
  });

  it("закрывает dialog по Escape и возвращает focus", async () => {
    const user = userEvent.setup();

    function DialogExample() {
      const [open, setOpen] = useState(false);

      return (
        <>
          <Button onClick={() => setOpen(true)}>Открыть справку</Button>
          <Dialog
            description="Краткое описание"
            onOpenChange={setOpen}
            open={open}
            title="Справка"
          >
            <p>Содержимое</p>
          </Dialog>
        </>
      );
    }

    render(<DialogExample />);
    const trigger = screen.getByRole("button", { name: "Открыть справку" });

    await user.click(trigger);

    expect(screen.getByRole("dialog", { name: "Справка" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Закрыть" })).toHaveFocus();

    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(screen.queryByRole("dialog", { name: "Справка" })).not.toBeInTheDocument();
    });
    expect(trigger).toHaveFocus();
  });
});
