// Localization service for the employee management application
class LocalizationService {
  constructor() {
    this.translations = {
      en: {
        // Navigation
        'nav.employeeList': 'Employee List',
        'nav.addEmployee': 'Add Employee',
        
        // Employee Add Page
        'employeeAdd.title': 'Add New Employee',
        
        // Employee List Page
        'employeeList.title': 'Employee List',
        'employeeList.addNew': 'Add New Employee',
        'employeeList.noEmployees': 'No employees found.',
        'employeeList.addFirst': 'Add the first employee',
        'employeeList.confirmDelete': 'Are you sure you want to delete this employee?',
        'employeeList.deleteConfirmTitle': 'Are you sure?',
        'employeeList.deleteConfirmMessage': 'Selected Employee record of {name} will be deleted',
        'employeeList.bulkDeleteConfirmTitle': 'Delete Multiple Employees',
        'employeeList.bulkDeleteConfirmMessage': '{count} employee records will be deleted. This action cannot be undone.',
        'employeeList.editConfirmTitle': 'Edit Employee',
        'employeeList.editConfirmMessage': 'Do you want to edit the employee record of {name}?',
        'employeeList.proceed': 'Proceed',
        'employeeList.cancel': 'Cancel',
        'employeeList.searchPlaceholder': 'Search employees...',
        'employeeList.clearSearch': 'Clear',
        'employeeList.showingResults': 'Showing {start}-{end} of {total} employees',
        'employeeList.noResults': 'No employees match your search.',
        'employeeList.itemsPerPage': 'Items per page:',
        'employeeList.page': 'Page',
        'employeeList.of': 'of',
        'employeeList.previous': 'Previous',
        'employeeList.next': 'Next',
        'employeeList.tableView': 'Table View',
        'employeeList.listView': 'List View',
        
        // Table Headers
        'table.firstName': 'First Name',
        'table.lastName': 'Last Name',
        'table.dateOfEmployment': 'Date of Employment',
        'table.dateOfBirth': 'Date of Birth',
        'table.phoneNumber': 'Phone Number',
        'table.emailAddress': 'Email Address',
        'table.department': 'Department',
        'table.position': 'Position',
        'table.actions': 'Actions',
        'table.selectedCount': '{count} selected',
        'table.clearSelection': 'Clear Selection',
        'table.deleteSelected': 'Delete Selected',
        
        // Validation Messages
        'validation.required': '{field} is required',
        'validation.invalidEmail': 'Please enter a valid email address',
        'validation.invalidPhone': 'Please enter a valid phone number',
        'validation.employmentAfterBirth': 'Employment date must be after birth date',
        
        // Buttons
        'button.edit': 'Edit',
        'button.delete': 'Delete',
        'button.save': 'Save',
        'button.cancel': 'Cancel',
        'button.addEmployee': 'Add Employee',
        'button.updateEmployee': 'Update Employee',
        'button.backToList': '← Back to List',
        
        // Form Labels
        'form.firstName': 'First Name',
        'form.lastName': 'Last Name',
        'form.dateOfEmployment': 'Date of Employment',
        'form.dateOfBirth': 'Date of Birth',
        'form.phoneNumber': 'Phone Number',
        'form.emailAddress': 'Email Address',
        'form.department': 'Department',
        'form.position': 'Position',
        'form.required': '*',
        
        // Form Placeholders
        'placeholder.firstName': 'Enter first name',
        'placeholder.lastName': 'Enter last name',
        'placeholder.phoneNumber': 'Enter phone number (10 digits)',
        'placeholder.emailAddress': 'Enter email address',
        'placeholder.selectDepartment': 'Select department',
        'placeholder.selectPosition': 'Select position',
        
        // Pages
        'page.addEmployee': 'Add Employee',
        'page.editEmployee': 'Edit Employee',
        'page.editingEmployee': 'You are editing {name}',
        
        // Employee Edit Page
        'employeeEdit.title': 'Edit Employee',
        'employeeEdit.editingEmployee': 'You are editing employee: {name}',
        
        // Employee Edit Confirmation
        'employeeEdit.confirmTitle': 'Confirm Changes',
        'employeeEdit.confirmMessage': 'Are you sure you want to update the employee record of {name}?',
        'employeeEdit.saveChanges': 'Save Changes',
        'employeeEdit.cancel': 'Cancel',
        'page.employeeNotFound': 'Employee Not Found',
        'page.loadingEmployee': 'Loading employee data...',
        
        // Departments
        'department.analytics': 'Analytics',
        'department.tech': 'Tech',
        
        // Positions
        'position.junior': 'Junior',
        'position.medior': 'Medior',
        'position.senior': 'Senior',
        
        // Validation Messages
        'validation.firstNameRequired': 'First name is required',
        'validation.lastNameRequired': 'Last name is required',
        'validation.dateOfEmploymentRequired': 'Date of employment is required',
        'validation.dateOfBirthRequired': 'Date of birth is required',
        'validation.ageMinimum': 'Employee must be at least 16 years old',
        'validation.phoneNumberRequired': 'Phone number is required',
        'validation.phoneNumberInvalid': 'Please enter a valid 10-digit phone number',
        'validation.emailAddressRequired': 'Email address is required',
        'validation.emailAddressInvalid': 'Please enter a valid email address',
        'validation.departmentRequired': 'Department is required',
        'validation.positionRequired': 'Position is required',
        
        // Confirmations
        'confirm.updateEmployee': 'Are you sure you want to update {name}\'s employee record?',
        'confirm.deleteEmployee': 'Are you sure you want to delete this employee?'
      },
      
      tr: {
        // Navigation
        'nav.employeeList': 'Çalışan Listesi',
        'nav.addEmployee': 'Çalışan Ekle',
        
        // Employee Add Page
        'employeeAdd.title': 'Yeni Çalışan Ekle',
        
        // Employee List Page
        'employeeList.title': 'Çalışan Listesi',
        'employeeList.addNew': 'Yeni Çalışan Ekle',
        'employeeList.noEmployees': 'Çalışan bulunamadı.',
        'employeeList.addFirst': 'İlk çalışanı ekleyin',
        'employeeList.confirmDelete': 'Bu çalışanı silmek istediğinizden emin misiniz?',
        'employeeList.deleteConfirmTitle': 'Emin misiniz?',
                'employeeList.deleteConfirmMessage': '{name} adlı çalışanın kaydı silinecektir',
        'employeeList.bulkDeleteConfirmTitle': 'Birden Fazla Çalışanı Sil',
        'employeeList.bulkDeleteConfirmMessage': '{count} çalışan kaydı silinecektir. Bu işlem geri alınamaz.',
        'employeeList.editConfirmTitle': 'Çalışanı Düzenle',
        'employeeList.editConfirmMessage': '{name} adlı çalışanın kaydını düzenlemek istiyor musunuz?',
        'employeeList.proceed': 'İlerle',
        'employeeList.cancel': 'İptal',
        'employeeList.searchPlaceholder': 'Çalışan ara...',
        'employeeList.clearSearch': 'Temizle',
        'employeeList.showingResults': '{total} çalışandan {start}-{end} gösteriliyor',
        'employeeList.noResults': 'Aramanızla eşleşen çalışan bulunamadı.',
        'employeeList.itemsPerPage': 'Sayfa başına öğe:',
        'employeeList.page': 'Sayfa',
        'employeeList.of': '/',
        'employeeList.previous': 'Önceki',
        'employeeList.next': 'Sonraki',
        'employeeList.tableView': 'Tablo Görünümü',
        'employeeList.listView': 'Liste Görünümü',
        
        // Table Headers
        'table.firstName': 'Ad',
        'table.lastName': 'Soyad',
        'table.dateOfEmployment': 'İşe Başlama Tarihi',
        'table.dateOfBirth': 'Doğum Tarihi',
        'table.phoneNumber': 'Telefon Numarası',
        'table.emailAddress': 'E-posta Adresi',
        'table.department': 'Departman',
        'table.position': 'Pozisyon',
        'table.actions': 'İşlemler',
        'table.selectedCount': '{count} seçildi',
        'table.clearSelection': 'Seçimi Temizle',
        'table.deleteSelected': 'Seçilenleri Sil',
        
        // Validation Messages
        'validation.required': '{field} gereklidir',
        'validation.invalidEmail': 'Lütfen geçerli bir e-posta adresi girin',
        'validation.invalidPhone': 'Lütfen geçerli bir telefon numarası girin',
        'validation.employmentAfterBirth': 'İşe giriş tarihi doğum tarihinden sonra olmalıdır',
        
        // Buttons
        'button.edit': 'Düzenle',
        'button.delete': 'Sil',
        'button.save': 'Kaydet',
        'button.cancel': 'İptal',
        'button.addEmployee': 'Çalışan Ekle',
        'button.updateEmployee': 'Çalışanı Güncelle',
        'button.backToList': '← Listeye Dön',
        
        // Form Labels
        'form.firstName': 'Ad',
        'form.lastName': 'Soyad',
        'form.dateOfEmployment': 'İşe Başlama Tarihi',
        'form.dateOfBirth': 'Doğum Tarihi',
        'form.phoneNumber': 'Telefon Numarası',
        'form.emailAddress': 'E-posta Adresi',
        'form.department': 'Departman',
        'form.position': 'Pozisyon',
        'form.required': '*',
        
        // Form Placeholders
        'placeholder.firstName': 'Adınızı girin',
        'placeholder.lastName': 'Soyadınızı girin',
        'placeholder.phoneNumber': 'Telefon numaranızı girin (10 haneli)',
        'placeholder.emailAddress': 'E-posta adresinizi girin',
        'placeholder.selectDepartment': 'Departman seçin',
        'placeholder.selectPosition': 'Pozisyon seçin',
        
        // Pages
        'page.addEmployee': 'Çalışan Ekle',
        'page.editEmployee': 'Çalışanı Düzenle',
        'page.editingEmployee': '{name} düzenliyorsunuz',
        
        // Employee Edit Page
        'employeeEdit.title': 'Çalışanı Düzenle',
        'employeeEdit.editingEmployee': 'Düzenlenen çalışan: {name}',
        
        // Employee Edit Confirmation
        'employeeEdit.confirmTitle': 'Değişiklikleri Onayla',
        'employeeEdit.confirmMessage': '{name} çalışanının kaydını güncellemek istediğinizden emin misiniz?',
        'employeeEdit.saveChanges': 'Değişiklikleri Kaydet',
        'employeeEdit.cancel': 'İptal',
        'page.employeeNotFound': 'Çalışan Bulunamadı',
        'page.loadingEmployee': 'Çalışan verileri yükleniyor...',
        
        // Departments
        'department.analytics': 'Analitik',
        'department.tech': 'Teknoloji',
        
        // Positions
        'position.junior': 'Yeni',
        'position.medior': 'Orta',
        'position.senior': 'Kıdemli',
        
        // Validation Messages
        'validation.firstNameRequired': 'Ad gereklidir',
        'validation.lastNameRequired': 'Soyad gereklidir',
        'validation.dateOfEmploymentRequired': 'İşe başlama tarihi gereklidir',
        'validation.dateOfBirthRequired': 'Doğum tarihi gereklidir',
        'validation.ageMinimum': 'Çalışan en az 16 yaşında olmalıdır',
        'validation.phoneNumberRequired': 'Telefon numarası gereklidir',
        'validation.phoneNumberInvalid': 'Lütfen geçerli 10 haneli telefon numarası girin',
        'validation.emailAddressRequired': 'E-posta adresi gereklidir',
        'validation.emailAddressInvalid': 'Lütfen geçerli e-posta adresi girin',
        'validation.departmentRequired': 'Departman gereklidir',
        'validation.positionRequired': 'Pozisyon gereklidir',
        
        // Confirmations
        'confirm.updateEmployee': '{name} adlı çalışanın kaydını güncellemek istediğinizden emin misiniz?',
        'confirm.deleteEmployee': 'Bu çalışanı silmek istediğinizden emin misiniz?'
      }
    };
    
    this.currentLanguage = this.detectLanguage();
  }

  detectLanguage() {
    // Read from HTML lang attribute
    const htmlLang = document.documentElement.getAttribute('lang');
    if (htmlLang && this.translations[htmlLang]) {
      return htmlLang;
    }
    
    // Fallback to browser language
    const browserLang = navigator.language.split('-')[0];
    if (this.translations[browserLang]) {
      return browserLang;
    }
    
    // Default to English
    return 'en';
  }

  setLanguage(lang) {
    if (this.translations[lang]) {
      this.currentLanguage = lang;
      // Update HTML lang attribute
      document.documentElement.setAttribute('lang', lang);
      
      // Dispatch custom event for components to listen
      window.dispatchEvent(new CustomEvent('language-changed', { 
        detail: { language: lang } 
      }));
    }
  }

  t(key, params = {}) {
    const translation = this.translations[this.currentLanguage]?.[key] || 
                       this.translations['en'][key] || 
                       key;
    
    // Replace parameters in translation
    return Object.keys(params).reduce((str, param) => {
      return str.replace(`{${param}}`, params[param]);
    }, translation);
  }

  getCurrentLanguage() {
    return this.currentLanguage;
  }

  getAvailableLanguages() {
    return Object.keys(this.translations);
  }
}

// Create singleton instance
export const i18n = new LocalizationService();