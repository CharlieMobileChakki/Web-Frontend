// Helper utilities for managing temporary addresses in localStorage for guest users

const TEMP_ADDRESSES_KEY = 'tempAddresses';

/**
 * Get all temporary addresses from localStorage
 * @returns {Array} Array of temporary address objects
 */
export const getTempAddresses = () => {
    try {
        const addresses = localStorage.getItem(TEMP_ADDRESSES_KEY);
        return addresses ? JSON.parse(addresses) : [];
    } catch (error) {
        console.error('Error reading temp addresses:', error);
        return [];
    }
};

/**
 * Save a new temporary address to localStorage
 * @param {Object} address - Address object to save
 * @returns {Object} Saved address with generated ID
 */
export const saveTempAddress = (address) => {
    try {
        const addresses = getTempAddresses();
        const newAddress = {
            ...address,
            _id: `temp_${Date.now()}`, // Generate temporary ID
            isTemporary: true,
            createdAt: new Date().toISOString()
        };
        addresses.push(newAddress);
        localStorage.setItem(TEMP_ADDRESSES_KEY, JSON.stringify(addresses));
        return newAddress;
    } catch (error) {
        console.error('Error saving temp address:', error);
        throw error;
    }
};

/**
 * Update a temporary address in localStorage
 * @param {String} addressId - ID of address to update
 * @param {Object} updatedData - Updated address data
 * @returns {Object} Updated address
 */
export const updateTempAddress = (addressId, updatedData) => {
    try {
        const addresses = getTempAddresses();
        const index = addresses.findIndex(addr => addr._id === addressId);

        if (index === -1) {
            throw new Error('Address not found');
        }

        addresses[index] = {
            ...addresses[index],
            ...updatedData,
            updatedAt: new Date().toISOString()
        };

        localStorage.setItem(TEMP_ADDRESSES_KEY, JSON.stringify(addresses));
        return addresses[index];
    } catch (error) {
        console.error('Error updating temp address:', error);
        throw error;
    }
};

/**
 * Delete a temporary address from localStorage
 * @param {String} addressId - ID of address to delete
 */
export const deleteTempAddress = (addressId) => {
    try {
        const addresses = getTempAddresses();
        const filtered = addresses.filter(addr => addr._id !== addressId);
        localStorage.setItem(TEMP_ADDRESSES_KEY, JSON.stringify(filtered));
    } catch (error) {
        console.error('Error deleting temp address:', error);
        throw error;
    }
};

/**
 * Clear all temporary addresses from localStorage
 */
export const clearTempAddresses = () => {
    try {
        localStorage.removeItem(TEMP_ADDRESSES_KEY);
    } catch (error) {
        console.error('Error clearing temp addresses:', error);
    }
};

/**
 * Check if an address is temporary
 * @param {Object} address - Address object to check
 * @returns {Boolean}
 */
export const isTempAddress = (address) => {
    return address?.isTemporary === true || address?._id?.startsWith('temp_');
};
