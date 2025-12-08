import { beforeAll } from "vitest";
import "./testing/index.css";

beforeAll(() => {
  document.body.classList.add("font-poppins", "bg-ground", "mud-theme");
});
