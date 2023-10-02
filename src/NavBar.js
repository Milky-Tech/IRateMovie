export const NavBar = ({ children }) => {
  return (
    <nav className="w-full py-4 block md:flex md:justify-around text-white bg-cyan-950">
      {children}
    </nav>
  );
};
