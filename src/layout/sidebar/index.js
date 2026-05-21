import LogoWrapper from "@/components/commonComponent/logoWrapper";
import AccountContext from "@/helper/accountContext";
import SettingContext from "@/helper/settingContext";
import dynamic from "next/dynamic";
import { useContext, useEffect, useMemo, useState } from "react";
import MENUITEMS from "./MenuData";

const MenuList = dynamic(() => import("./MenuList"), {
  ssr: false,
});

// Recursively filter out menu items whose `flag` is disabled in the
// storefront's settings.activation map. Used to gate Earning Points (and
// any future feature toggle) without deleting code.
const filterMenuByFlags = (items, activation) =>
  items
    .filter((item) => !item.flag || activation?.[item.flag])
    .map((item) => (item.children ? { ...item, children: filterMenuByFlags(item.children, activation) } : item));

const Sidebar = () => {
  const [activeMenu, setActiveMenu] = useState([]);
  const { role, setRole } = useContext(AccountContext);
  const { sidebarOpen, setSidebarOpen, settingObj } = useContext(SettingContext);

  const visibleMenu = useMemo(
    () => filterMenuByFlags(MENUITEMS, settingObj?.activation || {}),
    [settingObj]
  );

  const [mounted, setMounted] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(false);
    }, 700);
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    let storedRole;
    const ISSERVER = typeof window === "undefined";
    if (!ISSERVER) {
      storedRole = localStorage.getItem("role");
    } else {
      storedRole = null;
    }

    if (storedRole) {
      const parsedRole = JSON.parse(storedRole);
      setRole(parsedRole.name);
    }
  }, []);


  return (
    <div className={`sidebar-wrapper ${sidebarOpen ? "close_icon" : ""}`}>
      <div className={`${mounted ? "skeleton-loader" : ""}`}>
        <LogoWrapper setSidebarOpen={setSidebarOpen} />
        <nav className="sidebar-main">
          <div id="sidebar-menu">
            <ul className="sidebar-links" id="simple-bar">
               <MenuList menu={visibleMenu} level={0} activeMenu={activeMenu} setActiveMenu={setActiveMenu} key={role} />
            </ul>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
