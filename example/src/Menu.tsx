import { Link } from "react-router-dom";

export const Menu = () => {
  return (
    <ul>
      <li>
        <Link to="breathe">Breathe</Link>
      </li>
      <li>
        <Link to="glassmorphism">Glassmorphism</Link>
      </li>
      <li>
        <Link to="playground">Playground</Link>
      </li>
    </ul>
  );
};
