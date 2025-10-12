// src/components/Layout/Sidebar.js
import React, { useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Users, Calendar, DollarSign, ShoppingCart,
  Package, Settings, BarChart3, Shield, Church,
  FileText, Clock, TrendingUp, Archive, ArrowLeft
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const Sidebar = ({ collapsed, toggleCollapse }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, hasPermission } = useAuth();
  const { theme } = useTheme();
  const flyoutRef = useRef(null);

  const menuItems = [
  { id: 'personal', title: 'Módulo Personal', icon: Users, path: '/personal', permission: 'personal' },
  {
    id: 'liturgical',
    title: 'Actos Litúrgicos',
    icon: Church,
    permission: 'liturgico',
    children: [
      { title: 'Gestionar Actos', path: '/liturgico/gestionar', icon: Church },
      { title: 'Horarios', path: '/liturgico/horarios', icon: Clock },
      { title: 'Reservas', path: '/liturgico/reservas', icon: Calendar },
      { title: 'Reportes', path: '/liturgico/reportes', icon: FileText }
    ]
  },
  { id: 'sales', title: 'Módulo Ventas', icon: TrendingUp, path: '/ventas', permission: 'ventas' },
  { id: 'purchases', title: 'Módulo Compras', icon: ShoppingCart, path: '/compras', permission: 'compras' },
  { id: 'warehouse', title: 'Módulo Almacén', icon: Package, path: '/almacen', permission: 'almacen' },
  { id: 'accounting', title: 'Módulo Contabilidad', icon: DollarSign, path: '/contabilidad', permission: 'contabilidad' },
  {
    id: 'reports',
    title: 'Módulo Reportes',
    icon: BarChart3,
    permission: 'reportes',
    children: [
      { title: 'Gerenciales', path: '/reportes/gerenciales', icon: TrendingUp },
      { title: 'Transaccionales', path: '/reportes/transaccionales', icon: Archive }
    ]
  },
  {
    id: 'security',
    title: 'Módulo Seguridad',
    icon: Shield,
    permission: 'seguridad',
    children: [
      { title: 'Usuarios', path: '/seguridad/usuarios', icon: Users },
      { title: 'Roles', path: '/seguridad/roles', icon: Shield },
      { title: 'Permisos', path: '/seguridad/permisos', icon: Settings }
    ]
  },
  { id: 'configuration', title: 'Módulo Configuración', icon: Settings, path: '/configuracion', permission: 'configuracion' }
];

  const getCurrentModule = () => {
    const currentPath = location.pathname;
    const parentModule = menuItems.find(item =>
      item.children?.some(child => currentPath.startsWith(child.path))
    );
    if (parentModule) return parentModule;
    return menuItems.find(item => currentPath.startsWith(item.path));
  };

  const currentModule = getCurrentModule();
  const filteredMenu = currentModule && hasPermission(currentModule.permission) ? currentModule : null;

  const isActive = (path) => location.pathname.startsWith(path);
  const isDarkTheme = theme === 'black';

  useEffect(() => {
    function handleClickOutside(event) {
      if (flyoutRef.current && !flyoutRef.current.contains(event.target)) {
        // nada por ahora
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <aside
      className="h-full flex flex-col shrink-0"
      style={{
        width: collapsed ? 80 : 256,
        background: "var(--surface)",
        borderRight: `1px solid var(--border)`
      }}
    >
      {/* Logo y Título */}
      <div
        onClick={toggleCollapse}
        className={`flex items-center gap-3 h-16 px-4 border-b cursor-pointer ${collapsed ? 'justify-center' : ''}`}
        style={{ borderColor: "var(--border)" }}
      >
        <Church className="w-8 h-8" style={{ color: "var(--primary)" }} />
        {!collapsed && (
          <div>
            <h1 className="text-lg font-bold" style={{ color: "var(--text)" }}>CHASKIS.DEV</h1>
            <p className="text-xs" style={{ color: "var(--muted)" }}>Sistema de Parroquia</p>
          </div>
        )}
      </div>

      {/* Menú actual */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-2 relative">
        {filteredMenu && (
          <>
            {/* 🔙 Botón regresar a Bienvenida */}
            <button
              onClick={() => navigate('/bienvenida')}
              className={`flex items-center w-full p-2 mb-3 rounded-lg font-medium transition-all ${collapsed ? 'justify-center' : 'gap-3'}`}
              style={{
                background: "transparent",
                color: "var(--muted)"
              }}
            >
              <ArrowLeft className="w-5 h-5" />
              {!collapsed && <span className="text-sm">Regresar</span>}
            </button>

            {filteredMenu.children ? (
              <div>
                {!collapsed && (
                  <p className="text-xs font-semibold px-2 mb-2" style={{ color: "var(--muted)" }}>
                    {filteredMenu.title}
                  </p>
                )}
                {filteredMenu.children.map(child => (
                  <Link
                    key={child.path}
                    to={child.path}
                    className={`flex items-center p-2 rounded-lg font-medium transition-all ${collapsed ? 'justify-center' : 'gap-3'}`}
                    style={{
                      background: isActive(child.path) ? "var(--surface-2)" : "transparent",
                      color: isActive(child.path)
                        ? (isDarkTheme ? "var(--text-strong)" : "var(--primary)")
                        : "var(--text)"
                    }}
                  >
                    <child.icon className="w-5 h-5" />
                    {!collapsed && <span className="text-sm">{child.title}</span>}
                  </Link>
                ))}
              </div>
            ) : (
              <Link
                to={filteredMenu.path}
                className={`flex items-center p-2 rounded-lg font-medium transition-all ${collapsed ? 'justify-center' : 'gap-3'}`}
                style={{
                  background: isActive(filteredMenu.path) ? "var(--surface-2)" : "transparent",
                  color: isActive(filteredMenu.path)
                    ? (isDarkTheme ? "var(--text-strong)" : "var(--primary)")
                    : "var(--text)"
                }}
              >
                <filteredMenu.icon className="w-5 h-5" />
                {!collapsed && <span className="text-sm">{filteredMenu.title}</span>}
              </Link>
            )}
          </>
        )}
      </nav>

      {/* Información usuario */}
      <div className="p-2 border-t" style={{ borderColor: "var(--border)" }}>
        <div className={`flex items-center gap-2 ${collapsed ? 'justify-center' : ''}`}>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, var(--primary), var(--secondary))"
            }}
          >
            <span className="text-white text-sm font-bold">{user?.name?.charAt(0) || 'U'}</span>
          </div>
          {!collapsed && (
            <div>
              <p className="text-sm font-medium truncate" style={{ color: "var(--text)" }}>{user?.name || 'Usuario'}</p>
              <p className="text-xs capitalize" style={{ color: "var(--muted)" }}>{user?.role || 'usuario'}</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
