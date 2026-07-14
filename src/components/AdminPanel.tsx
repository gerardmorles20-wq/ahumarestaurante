/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Shield, Lock, Eye, EyeOff, Plus, Trash2, Edit2, Check, RefreshCw, Save, X, ToggleLeft, ToggleRight, Settings, Layers, Beef, Users, UserPlus, Clock, Calendar, Chrome } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product, Category, RestaurantInfo } from '../types';
import { ImageUploader } from './ImageUploader';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../lib/firebase';

interface AdminPanelProps {
  onLockAdmin?: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onLockAdmin }) => {
  const {
    categories,
    products,
    restaurantInfo,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    updateCategory,
    deleteCategory,
    updateRestaurantInfo,
    resetToDefaults,
  } = useStore();

  // Authentication State
  const [loginEmail, setLoginEmail] = useState('admin@ahumasteakhouse.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('ahuma_admin_auth') === 'true';
  });
  const [authError, setAuthError] = useState('');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Persisted multi-admin accounts
  interface AdminAccount {
    email: string;
    clave: string;
    name: string;
  }

  const [adminAccounts, setAdminAccounts] = useState<AdminAccount[]>(() => {
    const saved = localStorage.getItem('ahuma_admin_accounts');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        // Fallback below
      }
    }
    const defaultAccounts: AdminAccount[] = [
      { email: 'admin@ahumasteakhouse.com', clave: '1234', name: 'Administrador Principal' }
    ];
    localStorage.setItem('ahuma_admin_accounts', JSON.stringify(defaultAccounts));
    return defaultAccounts;
  });

  const [currentLoggedInEmail, setCurrentLoggedInEmail] = useState(() => {
    return sessionStorage.getItem('ahuma_current_admin_email') || 'admin@ahumasteakhouse.com';
  });

  // Password Recovery Flow State
  const [isRecovering, setIsRecovering] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoverySuccess, setRecoverySuccess] = useState('');
  const [recoveryError, setRecoveryError] = useState('');

  // Password Change Form State
  const [oldPasswordForm, setOldPasswordForm] = useState('');
  const [newPasswordForm, setNewPasswordForm] = useState('');
  const [confirmPasswordForm, setConfirmPasswordForm] = useState('');
  const [passwordChangeError, setPasswordChangeError] = useState('');
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState('');

  // Registration Form State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState('');

  // Tab State
  const [adminTab, setAdminTab] = useState<'products' | 'categories' | 'config' | 'admins'>('products');

  // Success Notification
  const [successMsg, setSuccessMsg] = useState('');

  // Custom Confirm Dialog State
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const triggerConfirm = (title: string, message: string, onConfirm: () => void) => {
    setConfirmDialog({
      isOpen: true,
      title,
      message,
      onConfirm: () => {
        onConfirm();
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // CRUD Product Form Modal State
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [prodForm, setProdForm] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    imageUrl: '',
    tagsString: '',
    ingredientsString: '',
    accompanimentsCount: 0,
    isOutOfStock: false,
    isRecommended: false,
  });

  // CRUD Category Form State
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('Flame');

  // Config Form State
  const [configForm, setConfigForm] = useState<RestaurantInfo>({ ...restaurantInfo });

  // Daily schedule builder state
  const [showScheduleBuilder, setShowScheduleBuilder] = useState(false);
  const [dailySchedules, setDailySchedules] = useState<{
    day: string;
    isOpen: boolean;
    openTime: string;
    closeTime: string;
  }[]>([
    { day: 'Lunes', isOpen: false, openTime: '12:00', closeTime: '22:00' },
    { day: 'Martes', isOpen: true, openTime: '12:00', closeTime: '22:00' },
    { day: 'Miércoles', isOpen: true, openTime: '12:00', closeTime: '22:00' },
    { day: 'Jueves', isOpen: true, openTime: '12:00', closeTime: '22:00' },
    { day: 'Viernes', isOpen: true, openTime: '12:00', closeTime: '22:00' },
    { day: 'Sábado', isOpen: true, openTime: '12:00', closeTime: '22:00' },
    { day: 'Domingo', isOpen: true, openTime: '12:00', closeTime: '22:00' },
  ]);

  const formatTime12h = (time24: string) => {
    if (!time24) return '';
    const [hours, minutes] = time24.split(':').map(Number);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 === 0 ? 12 : hours % 12;
    const minutesStr = minutes < 10 ? `0${minutes}` : minutes;
    return `${hours12}:${minutesStr} ${ampm}`;
  };

  const generateScheduleString = (schedules: typeof dailySchedules) => {
    const openDays = schedules.filter(s => s.isOpen);
    if (openDays.length === 0) {
      return 'Cerrado temporalmente';
    }

    const firstOpen = openDays[0];
    const allSameHours = openDays.every(
      s => s.openTime === firstOpen.openTime && s.closeTime === firstOpen.closeTime
    );

    const closedDays = schedules.filter(s => !s.isOpen).map(s => s.day);
    const closedText = closedDays.length > 0 ? ` (${closedDays.join(', ')} cerrado)` : '';

    if (allSameHours) {
      const openDayNames = openDays.map(s => s.day);
      const timeRange = `${formatTime12h(firstOpen.openTime)} - ${formatTime12h(firstOpen.closeTime)}`;

      if (openDays.length === 7) {
        return `Todos los días: ${timeRange}`;
      }

      if (
        openDays.length === 6 &&
        !schedules.find(s => s.day === 'Lunes')?.isOpen
      ) {
        return `Martes a Domingo: ${timeRange}${closedText}`;
      }

      const lvOpen = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'].every(d =>
        schedules.find(s => s.day === d)?.isOpen
      );
      const ssClosed = ['Sábado', 'Domingo'].every(d =>
        !schedules.find(s => s.day === d)?.isOpen
      );
      if (lvOpen && ssClosed) {
        return `Lunes a Viernes: ${timeRange}${closedText}`;
      }

      return `${openDayNames.join(', ')}: ${timeRange}${closedText}`;
    }

    const lines = schedules.map(s => {
      if (!s.isOpen) {
        return `${s.day}: Cerrado`;
      }
      return `${s.day}: ${formatTime12h(s.openTime)} - ${formatTime12h(s.closeTime)}`;
    });
    return lines.join(' | ');
  };

  const handleUpdateDailySchedule = (index: number, fields: Partial<(typeof dailySchedules)[0]>) => {
    const updated = dailySchedules.map((s, idx) => (idx === index ? { ...s, ...fields } : s));
    setDailySchedules(updated);
    const generated = generateScheduleString(updated);
    setConfigForm(prev => ({ ...prev, schedule: generated }));
  };

  useEffect(() => {
    setConfigForm({ ...restaurantInfo });
  }, [restaurantInfo]);

  // Handle Authentication
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = loginEmail.trim().toLowerCase();
    const found = adminAccounts.find(
      (acc) => acc.email.toLowerCase() === cleanEmail && acc.clave === password
    );

    if (found) {
      setIsAuthenticated(true);
      sessionStorage.setItem('ahuma_admin_auth', 'true');
      sessionStorage.setItem('ahuma_current_admin_email', found.email);
      setCurrentLoggedInEmail(found.email);
      setAuthError('');
      // Populate config state
      setConfigForm({ ...restaurantInfo });
    } else {
      setAuthError('Correo o clave de administrador incorrectos.');
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setAuthError('');
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user && user.email) {
        const cleanEmail = user.email.trim().toLowerCase();

        // Check if the email matches any registered admin
        let found = adminAccounts.find(
          (acc) => acc.email.toLowerCase() === cleanEmail
        );

        // Fail-safe / recovery option for owner's email
        if (!found && cleanEmail === 'gerardmorles20@gmail.com') {
          const newAdmin: AdminAccount = {
            name: user.displayName || 'Gerard Morles (Google)',
            email: cleanEmail,
            clave: 'GoogleAuthSecure',
          };

          const updated = [...adminAccounts];
          // Filter out existing duplicates
          const filtered = updated.filter(acc => acc.email.toLowerCase() !== cleanEmail);
          filtered.push(newAdmin);
          setAdminAccounts(filtered);
          localStorage.setItem('ahuma_admin_accounts', JSON.stringify(filtered));
          found = newAdmin;
        }

        if (found) {
          setIsAuthenticated(true);
          sessionStorage.setItem('ahuma_admin_auth', 'true');
          sessionStorage.setItem('ahuma_current_admin_email', found.email);
          setCurrentLoggedInEmail(found.email);
          setAuthError('');
          setConfigForm({ ...restaurantInfo });
          showToast(`¡Bienvenido, ${found.name}!`);
        } else {
          setAuthError(`El correo de Google (${cleanEmail}) no está registrado como administrador.`);
        }
      } else {
        setAuthError('No se pudo obtener la información de tu cuenta de Google.');
      }
    } catch (err: any) {
      console.error('Google Auth error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setAuthError('Inicio de sesión cancelado.');
      } else if (err.code === 'auth/cancelled-popup-request') {
        setAuthError('Solicitud de popup cancelada.');
      } else {
        setAuthError(`Error de Google Auth: ${err.message || err}`);
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('ahuma_admin_auth');
    sessionStorage.removeItem('ahuma_current_admin_email');
    setCurrentLoggedInEmail('');
    setPassword('');
    onLockAdmin?.();
  };

  const handleRecoverPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryError('');
    setRecoverySuccess('');

    if (!recoveryEmail.trim()) {
      setRecoveryError('Por favor ingresa un correo electrónico.');
      return;
    }

    const cleanEmail = recoveryEmail.trim().toLowerCase();
    const found = adminAccounts.find((acc) => acc.email.toLowerCase() === cleanEmail);

    if (found) {
      setRecoverySuccess(
        `Se han enviado las instrucciones de recuperación a la dirección registrada: ${found.email}. Para agilizar la demostración de este entorno, puedes usar la clave: ${found.clave}`
      );
    } else {
      setRecoveryError('El correo ingresado no coincide con ningún administrador registrado.');
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeError('');
    setPasswordChangeSuccess('');

    if (!oldPasswordForm || !newPasswordForm || !confirmPasswordForm) {
      setPasswordChangeError('Todos los campos son obligatorios.');
      return;
    }

    const currentAdminIdx = adminAccounts.findIndex(
      (acc) => acc.email.toLowerCase() === currentLoggedInEmail.toLowerCase()
    );

    if (currentAdminIdx === -1) {
      setPasswordChangeError('No se encontró la sesión del administrador actual.');
      return;
    }

    const currentAdmin = adminAccounts[currentAdminIdx];

    if (oldPasswordForm !== currentAdmin.clave) {
      setPasswordChangeError('La contraseña antigua es incorrecta.');
      return;
    }

    if (newPasswordForm !== confirmPasswordForm) {
      setPasswordChangeError('Las nuevas contraseñas no coinciden.');
      return;
    }

    if (newPasswordForm.length < 4) {
      setPasswordChangeError('La nueva contraseña debe tener al menos 4 caracteres.');
      return;
    }

    // Update inside array
    const updated = [...adminAccounts];
    updated[currentAdminIdx] = {
      ...currentAdmin,
      clave: newPasswordForm,
    };

    setAdminAccounts(updated);
    localStorage.setItem('ahuma_admin_accounts', JSON.stringify(updated));
    
    setOldPasswordForm('');
    setNewPasswordForm('');
    setConfirmPasswordForm('');
    setPasswordChangeSuccess('¡Contraseña de administrador actualizada con éxito!');
  };

  const handleRegisterAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    setRegSuccess('');

    if (!regName.trim() || !regEmail.trim() || !regPassword || !regConfirmPassword) {
      setRegError('Todos los campos son obligatorios.');
      return;
    }

    if (adminAccounts.length >= 2) {
      setRegError('Límite alcanzado: Sólo se permiten máximo 2 administradores.');
      return;
    }

    const cleanEmail = regEmail.trim().toLowerCase();
    const emailExists = adminAccounts.some((acc) => acc.email.toLowerCase() === cleanEmail);
    if (emailExists) {
      setRegError('El correo electrónico ya está registrado.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegError('Las contraseñas no coinciden.');
      return;
    }

    if (regPassword.length < 4) {
      setRegError('La contraseña debe tener al menos 4 caracteres.');
      return;
    }

    const newAdmin: AdminAccount = {
      name: regName.trim(),
      email: cleanEmail,
      clave: regPassword,
    };

    const updated = [...adminAccounts, newAdmin];
    setAdminAccounts(updated);
    localStorage.setItem('ahuma_admin_accounts', JSON.stringify(updated));

    setRegName('');
    setRegEmail('');
    setRegPassword('');
    setRegConfirmPassword('');
    setRegSuccess('¡Nuevo administrador registrado con éxito!');
    showToast('¡Administrador registrado!');
  };

  const handleDeleteAdmin = (emailToDelete: string) => {
    if (emailToDelete.toLowerCase() === currentLoggedInEmail.toLowerCase()) {
      showToast('No puedes eliminar tu propia cuenta de administrador.');
      return;
    }

    triggerConfirm(
      'Eliminar Administrador',
      `¿Estás seguro de que deseas eliminar este registro de administrador (${emailToDelete})? Esto revocará su acceso por completo.`,
      () => {
        const updated = adminAccounts.filter(
          (acc) => acc.email.toLowerCase() !== emailToDelete.toLowerCase()
        );
        setAdminAccounts(updated);
        localStorage.setItem('ahuma_admin_accounts', JSON.stringify(updated));
        showToast('Administrador eliminado correctamente.');
      }
    );
  };

  const showToast = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  // CRUD Product Handlers
  const handleOpenProductModal = (product?: Product) => {
    if (product) {
      setEditingProductId(product.id);
      setProdForm({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        imageUrl: product.imageUrl,
        tagsString: product.tags ? product.tags.join(', ') : '',
        ingredientsString: product.ingredients ? product.ingredients.join(', ') : '',
        accompanimentsCount: product.accompanimentsCount || 0,
        isOutOfStock: !!product.isOutOfStock,
        isRecommended: !!product.isRecommended,
      });
    } else {
      setEditingProductId(null);
      setProdForm({
        name: '',
        description: '',
        price: 0,
        category: categories[0]?.id || '',
        imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600',
        tagsString: '',
        ingredientsString: '',
        accompanimentsCount: 0,
        isOutOfStock: false,
        isRecommended: false,
      });
    }
    setProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();

    const parsedTags = prodForm.tagsString
      ? prodForm.tagsString.split(',').map((t) => t.trim()).filter(Boolean)
      : [];

    const parsedIngredients = prodForm.ingredientsString
      ? prodForm.ingredientsString.split(',').map((i) => i.trim()).filter(Boolean)
      : [];

    const productPayload = {
      name: prodForm.name,
      description: prodForm.description,
      price: Number(prodForm.price),
      category: prodForm.category,
      imageUrl: prodForm.imageUrl,
      tags: parsedTags,
      ingredients: parsedIngredients,
      accompanimentsCount: Number(prodForm.accompanimentsCount),
      isOutOfStock: prodForm.isOutOfStock,
      isRecommended: prodForm.isRecommended,
    };

    if (editingProductId) {
      updateProduct(editingProductId, productPayload);
      showToast('¡Producto actualizado exitosamente!');
    } else {
      addProduct(productPayload);
      showToast('¡Nuevo producto agregado exitosamente!');
    }

    setProductModalOpen(false);
  };

  const handleDeleteProduct = (id: string, name: string) => {
    triggerConfirm(
      'Eliminar Producto',
      `¿Estás seguro de que quieres eliminar "${name}"? Esta acción no se puede deshacer.`,
      () => {
        deleteProduct(id);
        showToast('Producto eliminado.');
      }
    );
  };

  // CRUD Category Handlers
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    addCategory({
      name: newCatName.trim(),
      icon: newCatIcon,
    });
    setNewCatName('');
    showToast('Categoría agregada exitosamente.');
  };

  const handleStartEditCategory = (cat: Category) => {
    setEditingCategoryId(cat.id);
    setNewCatName(cat.name);
  };

  const handleSaveCategoryEdit = (id: string) => {
    if (!newCatName.trim()) return;
    updateCategory(id, newCatName.trim());
    setEditingCategoryId(null);
    setNewCatName('');
    showToast('Categoría modificada.');
  };

  const handleDeleteCategory = (id: string, name: string) => {
    triggerConfirm(
      'Eliminar Categoría',
      `Al eliminar la categoría "${name}", se ELIMINARÁN también todos los productos asociados. ¿Quieres continuar?`,
      () => {
        deleteCategory(id);
        showToast('Categoría y productos asociados eliminados.');
      }
    );
  };

  // General Config Handler
  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateRestaurantInfo(configForm);
    showToast('Configuraciones generales actualizadas.');
  };

  // Helper Formater
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#0D0D0D] flex flex-col text-left relative pb-8">
      {/* Floating Success Alert Toast */}
      {successMsg && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-xs font-black tracking-wide shadow-lg border border-emerald-500 z-50 flex items-center gap-1.5 animate-bounce">
          <Check size={14} strokeWidth={3} />
          {successMsg}
        </div>
      )}

      {/* Custom Confirmation Modal */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-[999] flex items-center justify-center p-4">
          <div className="bg-[#161616] border border-white/10 rounded-2xl p-5 w-full max-w-sm space-y-4 shadow-2xl text-left">
            <h4 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
              <span className="w-1.5 h-3.5 bg-[#FF5A20] rounded-sm inline-block"></span>
              {confirmDialog.title}
            </h4>
            <p className="text-xs text-white/75 leading-relaxed">
              {confirmDialog.message}
            </p>
            <div className="flex gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
                className="flex-1 bg-[#0D0D0D] hover:bg-white/5 border border-white/5 hover:border-white/10 text-white/80 py-2.5 rounded-xl text-xs font-bold transition-all"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmDialog.onConfirm}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-red-600/10 transition-all"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 1. LOGIN GATE SCREEN */}
      {!isAuthenticated ? (
        <div className="flex-1 flex flex-col justify-center items-center px-6 py-16 gap-6">
          <div className="w-14 h-14 rounded-2xl bg-[#FF5A20]/10 border border-[#FF5A20]/20 flex items-center justify-center text-[#FF5A20]">
            <Lock size={24} />
          </div>

          <div className="text-center space-y-1.5">
            <h2 className="text-lg font-black text-white uppercase tracking-wider">Acceso Restringido</h2>
            <p className="text-[11px] text-white/40 max-w-xs leading-relaxed">
              Para realizar cambios en categorías, productos, precios, fotos y horarios de Ahuma, debes iniciar sesión exclusivamente con tu cuenta de Google autorizada.
            </p>
          </div>

          <div className="w-full max-w-xs space-y-4">
            {authError && (
              <div className="p-3 bg-red-950/10 border border-red-900/30 text-red-400 rounded-xl text-[11px] font-bold text-center animate-pulse">
                {authError}
              </div>
            )}

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading}
              className="w-full bg-white hover:bg-gray-100 text-[#0D0D0D] py-3.5 px-4 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2.5 shadow-lg shadow-white/5 transition-all active:scale-98 disabled:opacity-50"
            >
              {isGoogleLoading ? (
                <RefreshCw className="animate-spin text-[#0D0D0D]" size={14} />
              ) : (
                <Chrome size={14} className="text-[#0D0D0D]" />
              )}
              {isGoogleLoading ? 'Iniciando sesión...' : 'Acceder con Google'}
            </button>
          </div>

          <p className="text-[10px] text-white/30 font-mono mt-4">
            Ahuma Admin Panel Gate v2.0 • Autenticación de Google Obligatoria
          </p>
        </div>
      ) : (
        // 2. LOGGED IN ADMINISTRATIVE PANEL
        <div className="flex-1 flex flex-col">
          {/* Admin Header Tabs */}
          <div className="px-5 pt-4 pb-3 bg-[#0D0D0D]/90 border-b border-white/10 flex items-center justify-between gap-4 sticky top-0 z-20">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none select-none">
              <button
                onClick={() => setAdminTab('products')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all ${
                  adminTab === 'products'
                    ? 'bg-[#FF5A20] text-[#0D0D0D]'
                    : 'bg-[#161616] text-white/60 hover:text-white'
                }`}
              >
                <Beef size={12} />
                Productos
              </button>

              <button
                onClick={() => setAdminTab('categories')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all ${
                  adminTab === 'categories'
                    ? 'bg-[#FF5A20] text-[#0D0D0D]'
                    : 'bg-[#161616] text-white/60 hover:text-white'
                }`}
              >
                <Layers size={12} />
                Categorías
              </button>

              <button
                onClick={() => setAdminTab('config')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all ${
                  adminTab === 'config'
                    ? 'bg-[#FF5A20] text-[#0D0D0D]'
                    : 'bg-[#161616] text-white/60 hover:text-white'
                }`}
              >
                <Settings size={12} />
                Config
              </button>

              <button
                onClick={() => setAdminTab('admins')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all ${
                  adminTab === 'admins'
                    ? 'bg-[#FF5A20] text-[#0D0D0D]'
                    : 'bg-[#161616] text-white/60 hover:text-white'
                }`}
              >
                <Users size={12} />
                Admins
              </button>
            </div>

            <button
              onClick={handleLogout}
              className="text-[10px] bg-[#161616] hover:bg-red-950/20 border border-white/10 hover:border-red-900/30 text-white/60 hover:text-red-400 font-black uppercase tracking-wider px-2.5 py-1.5 rounded-lg transition-all"
            >
              Salir
            </button>
          </div>

          {/* Sub Tab: Products CRUD */}
          {adminTab === 'products' && (
            <div className="px-5 py-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase text-white/40 tracking-wider">
                  Listado de Productos ({products.length})
                </h3>
                <button
                  onClick={() => handleOpenProductModal()}
                  className="bg-[#FF5A20]/10 hover:bg-[#FF5A20]/20 text-[#FF5A20] border border-[#FF5A20]/20 rounded-xl px-3 py-1.5 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition-all"
                >
                  <Plus size={12} strokeWidth={3} />
                  Nuevo Producto
                </button>
              </div>

              {/* Product Listing */}
              <div className="space-y-2">
                {products.map((p) => (
                  <div
                    key={p.id}
                    className="bg-[#161616] border border-white/5 rounded-xl p-3 flex gap-3 items-center"
                  >
                    <div className="w-11 h-11 bg-[#0D0D0D] rounded-lg overflow-hidden shrink-0">
                      <img src={p.imageUrl} alt={p.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-white truncate">{p.name}</h4>
                        {p.isOutOfStock && (
                          <span className="bg-red-955/40 text-red-400 border border-red-900/20 text-[8px] font-bold px-1.5 py-0.2 rounded uppercase">
                            Agotado
                          </span>
                        )}
                        {p.isRecommended && (
                          <span className="bg-amber-955/40 text-amber-500 border border-amber-900/20 text-[8px] font-bold px-1.5 py-0.2 rounded uppercase">
                            ★ Rec
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-white/40 font-mono mt-0.5">
                        {categories.find((c) => c.id === p.category)?.name || 'Sin Categoría'} • {formatPrice(p.price)}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleOpenProductModal(p)}
                        className="p-1.5 bg-[#0D0D0D] hover:bg-[#161616] text-white/60 hover:text-[#FF5A20] rounded-lg border border-white/5 transition-colors"
                        title="Editar"
                      >
                        <Edit2 size={12} />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.id, p.name)}
                        className="p-1.5 bg-[#0D0D0D] hover:bg-red-955/20 text-white/30 hover:text-red-400 rounded-lg border border-white/5 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sub Tab: Categories CRUD */}
          {adminTab === 'categories' && (
            <div className="px-5 py-4 space-y-4">
              <h3 className="text-xs font-black uppercase text-white/40 tracking-wider">
                Administrar Categorías ({categories.length})
              </h3>

              {/* Add category form */}
              <form onSubmit={handleAddCategory} className="bg-[#161616] border border-white/5 rounded-2xl p-4 space-y-3">
                <span className="text-[9px] font-black uppercase text-white/40 tracking-wider">Nueva Categoría</span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    placeholder="Nombre, ej: Postres"
                    className="flex-1 bg-[#0D0D0D] border border-white/5 focus:border-[#FF5A20] rounded-xl px-3 py-2 text-xs text-white outline-none transition-all placeholder:text-white/20"
                  />
                  <button
                    type="submit"
                    className="bg-[#FF5A20] hover:bg-amber-600 text-[#0D0D0D] px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1 transition-colors"
                  >
                    <Plus size={14} strokeWidth={3} />
                    Agregar
                  </button>
                </div>
              </form>

              {/* Categories list */}
              <div className="space-y-2">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="bg-[#161616] border border-white/5 rounded-xl p-3 flex items-center justify-between gap-3"
                  >
                    {editingCategoryId === cat.id ? (
                      <div className="flex-1 flex gap-2">
                        <input
                          type="text"
                          value={newCatName}
                          onChange={(e) => setNewCatName(e.target.value)}
                          className="flex-1 bg-[#0D0D0D] border border-[#FF5A20] rounded-lg px-2.5 py-1 text-xs text-white outline-none"
                        />
                        <button
                          onClick={() => handleSaveCategoryEdit(cat.id)}
                          className="p-1.5 bg-[#FF5A20] text-[#0D0D0D] rounded-lg"
                        >
                          <Check size={12} strokeWidth={3} />
                        </button>
                        <button
                          onClick={() => setEditingCategoryId(null)}
                          className="p-1.5 bg-[#0D0D0D] border border-white/5 text-white/60 rounded-lg"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="text-xs font-bold text-white">{cat.name}</span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleStartEditCategory(cat)}
                            className="p-1.5 bg-[#0D0D0D] hover:bg-[#161616] text-white/60 hover:text-[#FF5A20] rounded-lg border border-white/5"
                          >
                            <Edit2 size={11} />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(cat.id, cat.name)}
                            className="p-1.5 bg-[#0D0D0D] hover:bg-red-955/20 text-white/30 hover:text-red-400 rounded-lg border border-white/5"
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sub Tab: General Config */}
          {adminTab === 'config' && (
            <form onSubmit={handleSaveConfig} className="px-5 py-4 space-y-4 text-xs">
              <h3 className="text-xs font-black uppercase text-white/40 tracking-wider">
                Parámetros del Sistema (Ahuma)
              </h3>

              {/* Nombre de la Marca */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-white/60 tracking-wider">
                  Nombre de la Marca
                </label>
                <input
                  type="text"
                  value={configForm.name || ''}
                  onChange={(e) => setConfigForm({ ...configForm, name: e.target.value })}
                  placeholder="Ej: Ahuma Steak House"
                  className="w-full bg-[#161616] border border-white/5 focus:border-[#FF5A20] rounded-xl py-2 px-3 text-white outline-none transition-all"
                  required
                />
              </div>

              {/* Imagen del Logo de la Marca */}
              <ImageUploader
                value={configForm.logoUrl || ''}
                onChange={(val) => setConfigForm({ ...configForm, logoUrl: val })}
                label="Imagen del Logo de la Marca"
                placeholder="Arrastra el logo de tu marca o haz clic para cargarlo"
                aspectRatioClassName="aspect-square max-w-[150px] mx-auto"
              />

              {/* Whatsapp */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-white/60 tracking-wider">
                  Número de WhatsApp Oficial (Sin espacios/simbolos)
                </label>
                <input
                  type="text"
                  value={configForm.whatsapp || ''}
                  onChange={(e) => setConfigForm({ ...configForm, whatsapp: e.target.value })}
                  placeholder="Ej: 3042300570"
                  className="w-full bg-[#161616] border border-white/5 focus:border-[#FF5A20] rounded-xl py-2 px-3 text-white outline-none transition-all font-mono"
                />
              </div>

              {/* Costo de Domicilio */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-white/60 tracking-wider">
                  Costo de Domicilio ($ COP)
                </label>
                <input
                  type="number"
                  value={configForm.deliveryCost || 0}
                  onChange={(e) => setConfigForm({ ...configForm, deliveryCost: Number(e.target.value) })}
                  className="w-full bg-[#161616] border border-white/5 focus:border-[#FF5A20] rounded-xl py-2 px-3 text-white outline-none transition-all font-mono"
                />
              </div>

              {/* Horario */}
              <div className="space-y-2 border border-white/5 bg-[#161616]/30 rounded-2xl p-3.5">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black uppercase text-white/60 tracking-wider flex items-center gap-1.5">
                    <Clock size={13} className="text-[#FF5A20]" />
                    Horario de Atención
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowScheduleBuilder(!showScheduleBuilder)}
                    className="text-[9px] font-black uppercase tracking-wider text-[#FF5A20] hover:text-amber-500 bg-[#FF5A20]/10 hover:bg-[#FF5A20]/15 px-2.5 py-1 rounded-lg transition-all flex items-center gap-1"
                  >
                    <Calendar size={11} />
                    {showScheduleBuilder ? 'Ocultar Asistente' : 'Asistente por Días'}
                  </button>
                </div>

                <div className="space-y-1.5">
                  <input
                    type="text"
                    value={configForm.schedule || ''}
                    onChange={(e) => setConfigForm({ ...configForm, schedule: e.target.value })}
                    className="w-full bg-[#161616] border border-white/5 focus:border-[#FF5A20] rounded-xl py-2 px-3 text-white outline-none transition-all font-sans text-xs"
                    placeholder="Ej: Martes a Domingo: 12:00 PM - 10:00 PM"
                  />
                  <p className="text-[9px] text-white/30 leading-normal">
                    Este texto es el que se muestra directamente en la sección "Info" de la app.
                  </p>
                </div>

                {showScheduleBuilder && (
                  <div className="mt-3.5 pt-3.5 border-t border-white/5 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black uppercase tracking-wider text-white/40">Configurar Días Individuales</span>
                      <span className="text-[8px] font-bold text-[#FF5A20]/70 uppercase tracking-widest bg-[#FF5A20]/5 px-2 py-0.5 rounded-md">Generación Automática</span>
                    </div>

                    <div className="space-y-2 bg-[#0D0D0D]/40 rounded-xl p-2.5 border border-white/5 max-h-56 overflow-y-auto scrollbar-none">
                      {dailySchedules.map((s, idx) => (
                        <div key={s.day} className="flex items-center justify-between gap-3 text-[11px] py-1 border-b border-white/5 last:border-0 last:pb-0 first:pt-0">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleUpdateDailySchedule(idx, { isOpen: !s.isOpen })}
                              className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                                s.isOpen 
                                  ? 'bg-[#FF5A20] border-[#FF5A20] text-[#0D0D0D]' 
                                  : 'bg-transparent border-white/20 text-transparent'
                              }`}
                            >
                              <Check size={11} strokeWidth={4} />
                            </button>
                            <span className={`font-bold transition-colors ${s.isOpen ? 'text-white' : 'text-white/30'}`}>
                              {s.day}
                            </span>
                          </div>

                          {s.isOpen ? (
                            <div className="flex items-center gap-1.5 font-mono text-[10px]">
                              <input
                                type="time"
                                value={s.openTime}
                                onChange={(e) => handleUpdateDailySchedule(idx, { openTime: e.target.value })}
                                className="bg-[#161616] border border-white/5 rounded px-1.5 py-0.5 text-white outline-none focus:border-[#FF5A20] [color-scheme:dark]"
                              />
                              <span className="text-white/30">a</span>
                              <input
                                type="time"
                                value={s.closeTime}
                                onChange={(e) => handleUpdateDailySchedule(idx, { closeTime: e.target.value })}
                                className="bg-[#161616] border border-white/5 rounded px-1.5 py-0.5 text-white outline-none focus:border-[#FF5A20] [color-scheme:dark]"
                              />
                            </div>
                          ) : (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-red-500/55 px-2 py-0.5 bg-red-955/10 rounded-md">
                              Cerrado
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Dirección Física */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-white/60 tracking-wider">
                  Ubicación: Dirección Física
                </label>
                <input
                  type="text"
                  value={configForm.address || ''}
                  onChange={(e) => setConfigForm({ ...configForm, address: e.target.value })}
                  className="w-full bg-[#161616] border border-white/5 focus:border-[#FF5A20] rounded-xl py-2 px-3 text-white outline-none transition-all"
                />
              </div>

              {/* Barrio */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-white/60 tracking-wider">
                  Ubicación: Barrio
                </label>
                <input
                  type="text"
                  value={configForm.neighborhood || ''}
                  onChange={(e) => setConfigForm({ ...configForm, neighborhood: e.target.value })}
                  className="w-full bg-[#161616] border border-white/5 focus:border-[#FF5A20] rounded-xl py-2 px-3 text-white outline-none transition-all"
                />
              </div>

              {/* Google Maps Enlace */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-white/60 tracking-wider">
                  Ubicación: Enlace Google Maps (Cómo llegar)
                </label>
                <input
                  type="text"
                  value={configForm.mapsUrl || ''}
                  onChange={(e) => setConfigForm({ ...configForm, mapsUrl: e.target.value })}
                  placeholder="Ej: https://maps.app.goo.gl/..."
                  className="w-full bg-[#161616] border border-white/5 focus:border-[#FF5A20] rounded-xl py-2 px-3 text-white outline-none transition-all font-mono"
                />
              </div>

              {/* Google Maps Embed */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-white/60 tracking-wider">
                  Ubicación: URL de Mapa Incrustado (iframe src)
                </label>
                <input
                  type="text"
                  value={configForm.mapsEmbedUrl || ''}
                  onChange={(e) => setConfigForm({ ...configForm, mapsEmbedUrl: e.target.value })}
                  placeholder="Ej: https://www.google.com/maps/embed?pb=..."
                  className="w-full bg-[#161616] border border-white/5 focus:border-[#FF5A20] rounded-xl py-2 px-3 text-white outline-none transition-all font-mono"
                />
              </div>

              {/* Imagen de Banner Principal (Home) */}
              <ImageUploader
                value={configForm.bannerUrl || ''}
                onChange={(val) => setConfigForm({ ...configForm, bannerUrl: val })}
                label="Imagen de Banner Principal (Home)"
                placeholder="Arrastra el banner principal o haz clic para cargarlo"
                aspectRatioClassName="aspect-video"
              />

              {/* Rating */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-white/60 tracking-wider">
                  Calificación Google (Rating)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={configForm.rating || 4.8}
                  onChange={(e) => setConfigForm({ ...configForm, rating: Number(e.target.value) })}
                  className="w-full bg-[#161616] border border-white/5 focus:border-[#FF5A20] rounded-xl py-2 px-3 text-white outline-none transition-all font-mono"
                />
              </div>

              {/* Botón de Papelera o Eliminación */}
              <div className="space-y-4 border border-white/5 bg-[#161616]/30 rounded-2xl p-3.5">
                <label className="text-[10px] font-black uppercase text-white/60 tracking-wider flex items-center gap-1.5">
                  <Trash2 size={13} className="text-[#FF5A20]" />
                  Botón de Papelera o Eliminación (Home)
                </label>
                
                <div className="flex items-center justify-between p-2.5 bg-[#0D0D0D]/40 rounded-xl border border-white/5">
                  <div className="space-y-0.5 pr-2">
                    <span className="text-[11px] font-bold text-white">Mostrar Botón</span>
                    <p className="text-[9px] text-white/40 leading-normal">Habilita un botón de papelera/eliminación rápida en la barra de acciones de la página de inicio.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setConfigForm({ ...configForm, showHomeTrashButton: !configForm.showHomeTrashButton })}
                    className="text-[#FF5A20] hover:text-amber-500 transition-colors"
                  >
                    {configForm.showHomeTrashButton ? (
                      <ToggleRight size={36} />
                    ) : (
                      <ToggleLeft size={36} className="opacity-40" />
                    )}
                  </button>
                </div>

                {configForm.showHomeTrashButton && (
                  <div className="space-y-3.5 pt-1 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase text-white/50 tracking-wide">
                        Texto o Etiqueta del Botón
                      </label>
                      <input
                        type="text"
                        value={configForm.homeTrashButtonText || ''}
                        onChange={(e) => setConfigForm({ ...configForm, homeTrashButtonText: e.target.value })}
                        placeholder="Ej: Vaciar"
                        className="w-full bg-[#161616] border border-white/5 focus:border-[#FF5A20] rounded-xl py-2 px-3 text-xs text-white outline-none transition-all font-sans"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase text-white/50 tracking-wide">
                        Acción al Presionar
                      </label>
                      <select
                        value={configForm.homeTrashButtonAction || 'clear_cart'}
                        onChange={(e) => setConfigForm({ ...configForm, homeTrashButtonAction: e.target.value as 'clear_cart' | 'clear_all' })}
                        className="w-full bg-[#161616] border border-white/5 focus:border-[#FF5A20] rounded-xl py-2 px-3 text-xs text-white outline-none transition-all font-sans"
                      >
                        <option value="clear_cart">Vaciar solo el Carrito</option>
                        <option value="clear_all">Vaciar Carrito y Datos de Envío</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-white/60 tracking-wider">
                  Descripción Corta
                </label>
                <textarea
                  value={configForm.description || ''}
                  onChange={(e) => setConfigForm({ ...configForm, description: e.target.value })}
                  className="w-full bg-[#161616] border border-white/5 focus:border-[#FF5A20] rounded-xl p-3 text-white outline-none transition-all h-20 resize-none font-sans"
                ></textarea>
              </div>

              {/* Historia */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-white/60 tracking-wider">
                  Historia de la Marca
                </label>
                <textarea
                  value={configForm.history || ''}
                  onChange={(e) => setConfigForm({ ...configForm, history: e.target.value })}
                  className="w-full bg-[#161616] border border-white/5 focus:border-[#FF5A20] rounded-xl p-3 text-white outline-none transition-all h-28 resize-none font-sans"
                ></textarea>
              </div>

              {/* --- PORTAL INFO CUSTOMIZATION --- */}
              <div className="pt-4 mt-2 border-t border-white/5 space-y-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-[#FF5A20] flex items-center gap-1.5">
                  <span className="w-1.5 h-3.5 bg-[#FF5A20] rounded-sm inline-block"></span>
                  Personalización del Portal "Info"
                </h4>

                {/* Imagen del Banner (Info) */}
                <ImageUploader
                  value={configForm.infoHeroUrl || ''}
                  onChange={(val) => setConfigForm({ ...configForm, infoHeroUrl: val })}
                  label="Imagen de Encabezado (Info)"
                  placeholder="Arrastra la imagen de encabezado o haz clic para cargarla"
                  aspectRatioClassName="aspect-[21/9]"
                />

                {/* Subtítulo / Esencia (Info) */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-white/60 tracking-wider">
                    Subtítulo de Esencia (Info)
                  </label>
                  <input
                    type="text"
                    value={configForm.infoSubtitle || ''}
                    onChange={(e) => setConfigForm({ ...configForm, infoSubtitle: e.target.value })}
                    placeholder="Ej: NUESTRA ESENCIA"
                    className="w-full bg-[#161616] border border-white/5 focus:border-[#FF5A20] rounded-xl py-2 px-3 text-white outline-none transition-all"
                  />
                </div>

                {/* Galería de Fotos (6 imágenes) */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-white/60 tracking-wider block">
                    Galería de Fotos del Portal (6 imágenes)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[0, 1, 2, 3, 4, 5].map((index) => {
                      const defaultGalleryImages = [
                        'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=400',
                        'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&q=80&w=400',
                        'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400',
                        'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=400',
                        'https://images.unsplash.com/photo-1627843563095-f6e94e70ecfc?auto=format&fit=crop&q=80&w=400',
                        'https://images.unsplash.com/photo-1608270176050-12ecd0f5243a?auto=format&fit=crop&q=80&w=400'
                      ];
                      const gallery = configForm.infoGalleryImages && configForm.infoGalleryImages.length > 0
                        ? configForm.infoGalleryImages
                        : defaultGalleryImages;
                      const currentUrl = gallery[index] || '';
                      return (
                        <div key={index} className="space-y-1 bg-[#161616]/30 border border-white/5 rounded-2xl p-2.5">
                          <ImageUploader
                            value={currentUrl}
                            onChange={(val) => {
                              const newGallery = [...gallery];
                              while (newGallery.length < 6) {
                                newGallery.push('');
                              }
                              newGallery[index] = val;
                              setConfigForm({ ...configForm, infoGalleryImages: newGallery });
                            }}
                            label={`Imagen ${index + 1}`}
                            placeholder="Cargar imagen"
                            aspectRatioClassName="aspect-square"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="h-2"></div>

              {/* Save Button */}
              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-[#FF5A20] hover:bg-amber-600 text-[#0D0D0D] py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/10 transition-colors"
                >
                  <Save size={14} />
                  Guardar Configuración
                </button>
                <button
                  type="button"
                  onClick={resetToDefaults}
                  className="px-3.5 bg-[#161616] hover:bg-red-955/20 border border-white/10 hover:border-red-900/30 text-white/60 hover:text-red-400 rounded-xl flex items-center justify-center"
                  title="Restablecer valores de fábrica"
                >
                  <RefreshCw size={14} />
                </button>
              </div>
            </form>
          )}

          {/* Sub Tab: Admins management */}
          {adminTab === 'admins' && (
            <div className="px-5 py-4 space-y-6 text-xs text-left">
              <div>
                <h3 className="text-xs font-black uppercase text-white/40 tracking-wider mb-3">
                  Administradores Registrados ({adminAccounts.length} de 2)
                </h3>
                
                <div className="space-y-2.5">
                  {adminAccounts.map((account) => {
                    const isSelf = account.email.toLowerCase() === currentLoggedInEmail.toLowerCase();
                    return (
                      <div
                        key={account.email}
                        className="bg-[#161616] border border-white/5 rounded-xl p-3.5 flex items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-white">{account.name}</span>
                            {isSelf ? (
                              <span className="px-2 py-0.5 bg-[#FF5A20]/15 text-[#FF5A20] rounded-md text-[8px] font-black uppercase tracking-wider">
                                Tú (Sesión Activa)
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 bg-white/5 text-white/40 rounded-md text-[8px] font-bold uppercase tracking-wider">
                                Co-Administrador
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-white/40 font-mono">{account.email}</div>
                        </div>

                        {!isSelf && (
                          <button
                            type="button"
                            onClick={() => handleDeleteAdmin(account.email)}
                            className="p-2.5 bg-[#0D0D0D] hover:bg-red-955/20 border border-white/5 hover:border-red-900/30 text-white/30 hover:text-red-400 rounded-xl transition-all"
                            title="Eliminar este administrador"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Registration Section */}
              {adminAccounts.length < 2 ? (
                <div className="bg-[#161616]/40 border border-dashed border-white/10 rounded-2xl p-4.5 space-y-4">
                  <div className="flex items-center gap-2 text-[#FF5A20]">
                    <UserPlus size={16} />
                    <h4 className="text-xs font-black uppercase tracking-wider">Registrar Nuevo Administrador</h4>
                  </div>
                  <p className="text-[10px] text-white/40 leading-relaxed">
                    Puedes agregar un segundo administrador único. Ambos tendrán acceso completo para modificar todos los datos, menú y configuraciones del negocio.
                  </p>

                  <form onSubmit={handleRegisterAdmin} className="space-y-3">
                    {regError && (
                      <div className="p-2.5 bg-red-950/10 border border-red-900/30 text-red-400 rounded-xl text-[10px] font-bold">
                        {regError}
                      </div>
                    )}
                    {regSuccess && (
                      <div className="p-2.5 bg-emerald-950/10 border border-emerald-900/30 text-emerald-400 rounded-xl text-[10px] font-bold">
                        {regSuccess}
                      </div>
                    )}

                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-white/40 tracking-wider">Nombre del Administrador</label>
                      <input
                        type="text"
                        required
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="Ej: Juan Pérez"
                        className="w-full bg-[#0D0D0D] border border-white/5 focus:border-[#FF5A20] rounded-xl py-2 px-3 text-white outline-none transition-all"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-white/40 tracking-wider">Correo Electrónico</label>
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="coadmin@ahumasteakhouse.com"
                        className="w-full bg-[#0D0D0D] border border-white/5 focus:border-[#FF5A20] rounded-xl py-2 px-3 text-white outline-none transition-all font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase text-white/40 tracking-wider">Contraseña (Clave)</label>
                        <input
                          type="password"
                          required
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          placeholder="Mín. 4 chars"
                          className="w-full bg-[#0D0D0D] border border-white/5 focus:border-[#FF5A20] rounded-xl py-2 px-3 text-white outline-none transition-all font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase text-white/40 tracking-wider">Confirmar Clave</label>
                        <input
                          type="password"
                          required
                          value={regConfirmPassword}
                          onChange={(e) => setRegConfirmPassword(e.target.value)}
                          placeholder="Confirmar clave"
                          className="w-full bg-[#0D0D0D] border border-white/5 focus:border-[#FF5A20] rounded-xl py-2 px-3 text-white outline-none transition-all font-mono"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#FF5A20] hover:bg-amber-600 text-[#0D0D0D] py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all active:scale-98 mt-2"
                    >
                      <UserPlus size={13} />
                      Registrar Administrador
                    </button>
                  </form>
                </div>
              ) : (
                <div className="bg-amber-950/10 border border-amber-900/30 rounded-2xl p-4 flex items-start gap-3 text-amber-400">
                  <Shield size={16} className="shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-[10px] font-black uppercase tracking-wider">Límite de Administradores Alcanzado</h4>
                    <p className="text-[9px] text-white/40 leading-relaxed">
                      El sistema está configurado para un máximo de 2 administradores únicos. Para registrar un administrador diferente, debes eliminar a uno de los actuales.
                    </p>
                  </div>
                </div>
              )}

              {/* Password Change Section (Self Only) */}
              <div className="bg-[#161616] border border-white/5 rounded-2xl p-4 space-y-4">
                <h4 className="text-xs font-black uppercase text-[#FF5A20] tracking-wider">
                  Cambiar Mi Contraseña Actual
                </h4>
                
                {passwordChangeError && (
                  <div className="p-2.5 bg-red-950/10 border border-red-900/30 text-red-400 rounded-xl text-[10px] font-bold">
                    {passwordChangeError}
                  </div>
                )}
                {passwordChangeSuccess && (
                  <div className="p-2.5 bg-emerald-950/10 border border-emerald-900/30 text-emerald-400 rounded-xl text-[10px] font-bold">
                    {passwordChangeSuccess}
                  </div>
                )}

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-white/50 tracking-wider">
                      Contraseña Antigua
                    </label>
                    <input
                      type="password"
                      value={oldPasswordForm}
                      onChange={(e) => setOldPasswordForm(e.target.value)}
                      className="w-full bg-[#0D0D0D] border border-white/5 focus:border-[#FF5A20] rounded-xl py-2.5 px-3 text-white outline-none transition-all font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-white/50 tracking-wider">
                        Nueva Contraseña
                      </label>
                      <input
                        type="password"
                        value={newPasswordForm}
                        onChange={(e) => setNewPasswordForm(e.target.value)}
                        className="w-full bg-[#0D0D0D] border border-white/5 focus:border-[#FF5A20] rounded-xl py-2 px-3 text-white outline-none transition-all font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-white/50 tracking-wider">
                        Confirmar Clave
                      </label>
                      <input
                        type="password"
                        value={confirmPasswordForm}
                        onChange={(e) => setConfirmPasswordForm(e.target.value)}
                        className="w-full bg-[#0D0D0D] border border-white/5 focus:border-[#FF5A20] rounded-xl py-2 px-3 text-white outline-none transition-all font-mono"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleChangePassword}
                  className="w-full bg-white/5 border border-white/10 hover:bg-[#FF5A20] hover:text-[#0D0D0D] hover:border-[#FF5A20] text-white/80 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-wider transition-all"
                >
                  Actualizar Mi Contraseña
                </button>
              </div>
            </div>
          )}
          {productModalOpen && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-xs z-50 flex flex-col justify-end">
              <div className="absolute inset-0 -z-10" onClick={() => setProductModalOpen(false)}></div>

              <form
                onSubmit={handleSaveProduct}
                className="bg-[#161616] border-t border-white/10 rounded-t-[32px] p-5 space-y-4 max-h-[85%] overflow-y-auto text-xs"
              >
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <h3 className="text-sm font-black uppercase tracking-wider text-[#FF5A20]">
                    {editingProductId ? 'Editar Producto' : 'Crear Producto'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setProductModalOpen(false)}
                    className="p-1 bg-[#0D0D0D] text-white/60 rounded-full hover:text-white"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Name */}
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-white/40 tracking-wider">Nombre del Plato *</label>
                  <input
                    type="text"
                    required
                    value={prodForm.name}
                    onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })}
                    className="w-full bg-[#0D0D0D] border border-white/5 focus:border-[#FF5A20] rounded-xl py-2 px-3 text-white outline-none transition-all"
                  />
                </div>

                {/* Category */}
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-white/40 tracking-wider">Categoría *</label>
                  <select
                    value={prodForm.category}
                    onChange={(e) => setProdForm({ ...prodForm, category: e.target.value })}
                    className="w-full bg-[#0D0D0D] border border-white/5 focus:border-[#FF5A20] rounded-xl py-2 px-3 text-white outline-none transition-all"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price */}
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-white/40 tracking-wider">Precio ($ COP) *</label>
                  <input
                    type="number"
                    required
                    value={prodForm.price}
                    onChange={(e) => setProdForm({ ...prodForm, price: Number(e.target.value) })}
                    className="w-full bg-[#0D0D0D] border border-white/5 focus:border-[#FF5A20] rounded-xl py-2 px-3 text-white outline-none transition-all font-mono"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-white/40 tracking-wider">Descripción del Plato</label>
                  <textarea
                    value={prodForm.description}
                    onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })}
                    className="w-full bg-[#0D0D0D] border border-white/5 focus:border-[#FF5A20] rounded-xl p-3 text-white outline-none transition-all h-16 resize-none font-sans"
                  ></textarea>
                </div>

                {/* Imagen del Plato */}
                <ImageUploader
                  value={prodForm.imageUrl}
                  onChange={(val) => setProdForm({ ...prodForm, imageUrl: val })}
                  label="Fotografía del Plato"
                  placeholder="Arrastra una foto del plato o haz clic para cargarla"
                  aspectRatioClassName="aspect-video"
                />

                {/* AccompanimentsCount */}
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-white/40 tracking-wider">
                    Cantidad de acompañantes a elegir (0 si no requiere)
                  </label>
                  <input
                    type="number"
                    value={prodForm.accompanimentsCount}
                    onChange={(e) => setProdForm({ ...prodForm, accompanimentsCount: Number(e.target.value) })}
                    className="w-full bg-[#0D0D0D] border border-white/5 focus:border-[#FF5A20] rounded-xl py-2 px-3 text-white outline-none transition-all font-mono"
                  />
                </div>

                {/* Tags */}
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-white/40 tracking-wider">
                    Etiquetas (Separadas por coma: ej. Nuevo, Picante, Recomendado)
                  </label>
                  <input
                    type="text"
                    value={prodForm.tagsString}
                    onChange={(e) => setProdForm({ ...prodForm, tagsString: e.target.value })}
                    placeholder="Nuevo, Recomendado"
                    className="w-full bg-[#0D0D0D] border border-white/5 focus:border-[#FF5A20] rounded-xl py-2 px-3 text-white outline-none transition-all"
                  />
                </div>

                {/* Ingredients */}
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-white/40 tracking-wider">
                    Ingredientes (Separados por coma: ej. Carne, Queso, Pan)
                  </label>
                  <input
                    type="text"
                    value={prodForm.ingredientsString}
                    onChange={(e) => setProdForm({ ...prodForm, ingredientsString: e.target.value })}
                    placeholder="Queso Cheddar, Tocineta"
                    className="w-full bg-[#0D0D0D] border border-white/5 focus:border-[#FF5A20] rounded-xl py-2 px-3 text-white outline-none transition-all"
                  />
                </div>

                {/* Toggles */}
                <div className="grid grid-cols-2 gap-3.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setProdForm({ ...prodForm, isOutOfStock: !prodForm.isOutOfStock })}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                      prodForm.isOutOfStock ? 'bg-red-950/20 border-red-500/50 text-red-400' : 'bg-[#0D0D0D] border-white/5 text-white/30'
                    }`}
                  >
                    <span className="font-bold">Agotado</span>
                    {prodForm.isOutOfStock ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setProdForm({ ...prodForm, isRecommended: !prodForm.isRecommended })}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                      prodForm.isRecommended ? 'bg-[#FF5A20]/10 border-[#FF5A20]/30 text-amber-400' : 'bg-[#0D0D0D] border-white/5 text-white/30'
                    }`}
                  >
                    <span className="font-bold">Recomendado</span>
                    {prodForm.isRecommended ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                  </button>
                </div>

                {/* Save button */}
                <button
                  type="submit"
                  className="w-full bg-[#FF5A20] hover:bg-amber-600 text-[#0D0D0D] py-3.5 rounded-xl font-black uppercase tracking-wider text-xs flex items-center justify-center gap-1 mt-4"
                >
                  <Check size={14} strokeWidth={3} />
                  Guardar Producto
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
