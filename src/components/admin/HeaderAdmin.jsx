const HeaderAdmin = ({ user, isOpen, isMobile }) => {
  return (
    <header
      className={`
        fixed top-0 right-0 h-13.5 lg:h-[4em] bg-white shadow flex items-center px-5 z-50
        transition-all duration-300
        ${!isMobile && isOpen ? "left-64" : "left-16"}
      `}
    >
      <h1 className="font-semibold text-lg flex-1">Admin Panel</h1>

      <div className="flex items-center gap-3">
        <img
          src={user.image}
          alt="user"
          className="w-10 h-10 rounded-full border"
        />
        <div className="hidden md:block text-right">
          <p className="font-semibold">{user.name}</p>
          <p className="text-xs text-gray-500">{user.email}</p>
        </div>
      </div>
    </header>
  );
};


export default HeaderAdmin;
