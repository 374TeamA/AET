import { ChangeEvent, useState } from "react";
import Group from "./Group";

interface ConfigureGraphProps {
  type: string;
}

export default function ConfigureGraph({ type }: ConfigureGraphProps) {
  const [categories, setCategories] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const addCategory = () => {
    const selectElement: HTMLSelectElement = document.getElementById(
      "addCategories"
    ) as HTMLSelectElement;

    // Get the selected option
    const selectedOption = selectElement.options[selectElement.selectedIndex];

    // Get the value of the selected option
    const category: string = selectedOption.value;

    setCategories([...categories, category]);
  };

  const deleteCategory = (index: number) => {
    const tempCategories = [...categories];
    tempCategories.splice(index, 1);
    setCategories(tempCategories);
  };

  const handleStartDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newDate: string = event.target.value;
    setStartDate(newDate);
  };

  const handleEndDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newDate: string = event.target.value;
    setEndDate(newDate);
  };

  return (
    <div>
      <h1>Configure {type} Graph</h1>
      <canvas id="configureGraph"></canvas>
      <Group label="Category">
        <select id="addCategories">
          <option value="Food">Food</option>
          <option value="Transportation">Transportation</option>
          <option value="Utilities">Utilities</option>
          <option value="Housing">Housing</option>
        </select>
        <button onClick={addCategory}>Add Category</button>
        <ul>
          {categories.map((item: string, index) => (
            <li key={index}>
              {item}
              <button onClick={() => deleteCategory(index)}>remove</button>
            </li>
          ))}
        </ul>
      </Group>

      <Group label="Date Range">
        <div>
          <label htmlFor="startDate">Start Date:</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={handleStartDateChange}
          />
        </div>
        <div>
          <label htmlFor="endDate">End Date:</label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={handleEndDateChange}
          />
        </div>
      </Group>
    </div>
  );
}
