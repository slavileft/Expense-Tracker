import { useState } from 'react';
import { Alert, Image, Platform, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { useHeaderHeight } from '@react-navigation/elements';
import { Ionicons } from '@expo/vector-icons';
import KeyboardScreen from '../../components/KeyboardScreen';
import FormInput from '../../components/FormInput';
import CategoryPicker from '../../components/CategoryPicker';
import PrimaryButton from '../../components/PrimaryButton';
import { useAuth } from '../../context/AuthContext';
import { createExpense, updateExpense } from '../../services/expenseService';
import { uploadReceipt } from '../../services/storageService';
import { formatDateObject, parseISODate, toISODate } from '../../utils/format';
import {
    validateTitle,
    validateAmount,
    validateCategory,
    validateNote,
    hasNoErrors,
} from '../../utils/validation';
import { colors } from '../../theme';

export default function ExpenseFormScreen({ navigation, route }) {
    const editingExpense = route.params?.expense;
    const { user } = useAuth();
    const headerHeight = useHeaderHeight();

    const [title, setTitle] = useState(editingExpense?.title ?? '');
    const [amount, setAmount] = useState(editingExpense ? String(editingExpense.amount) : '');
    const [category, setCategory] = useState(editingExpense?.category ?? '');
    const [date, setDate] = useState(editingExpense ? parseISODate(editingExpense.date) : new Date());
    const [isRecurring, setIsRecurring] = useState(editingExpense?.is_recurring ?? false);
    const [note, setNote] = useState(editingExpense?.note ?? '');
    const [photoUri, setPhotoUri] = useState(editingExpense?.receipt_url ?? null);

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');
    const [saving, setSaving] = useState(false);

    function handleDateChange(event, selectedDate) {
        setDate(selectedDate);
        if (Platform.OS === 'android') setShowDatePicker(false);
    }

    function handleDatePickerDismiss() {
        setShowDatePicker(false);
    }

    async function takePhoto() {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
            Alert.alert('Permission needed', 'Please allow camera access to take a receipt photo.');
            return;
        }
        const result = await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 0.5 });
        if (!result.canceled) setPhotoUri(result.assets[0].uri);
    }

    async function pickPhoto() {
        const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.5 });
        if (!result.canceled) setPhotoUri(result.assets[0].uri);
    }

    async function handleSave() {
        setServerError('');

        const newErrors = {
            title: validateTitle(title),
            amount: validateAmount(amount),
            category: validateCategory(category),
            note: validateNote(note),
        };
        setErrors(newErrors);
        if (!hasNoErrors(newErrors)) return;

        setSaving(true);
        try {
            let receiptUrl = photoUri;
            if (photoUri && !photoUri.startsWith('http')) {
                receiptUrl = await uploadReceipt(photoUri, user.id);
            }

            const expenseData = {
                title: title.trim(),
                amount: Number(amount.replace(',', '.')),
                category,
                date: toISODate(date),
                is_recurring: isRecurring,
                note: note.trim() || null,
                receipt_url: receiptUrl,
            };

            if (editingExpense) {
                await updateExpense(editingExpense.id, expenseData);
            } else {
                await createExpense(expenseData);
            }

            navigation.goBack();
        } catch (error) {
            setServerError(error.message);
            setSaving(false);
        }
    }

    return (
        <KeyboardScreen headerHeight={headerHeight}>
            <FormInput
                label="Title"
                value={title}
                onChangeText={setTitle}
                error={errors.title}
                placeholder="e.g. Groceries"
            />

            <FormInput
                label="Amount (€)"
                value={amount}
                onChangeText={setAmount}
                error={errors.amount}
                placeholder="0.00"
                keyboardType="decimal-pad"
            />

            <CategoryPicker value={category} onChange={setCategory} error={errors.category} />

            <Text style={styles.label}>Date</Text>
            <Pressable style={styles.dateButton} onPress={() => setShowDatePicker(!showDatePicker)}>
                <Text style={styles.dateText}>{formatDateObject(date, true)}</Text>
                <Ionicons name="calendar-outline" size={20} color={colors.muted} />
            </Pressable>
            {showDatePicker && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'inline' : 'default'}
                    maximumDate={new Date()}
                    onValueChange={handleDateChange}
                    onDismiss={handleDatePickerDismiss}
                />
            )}

            <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Recurring expense</Text>
                <Switch
                    value={isRecurring}
                    onValueChange={setIsRecurring}
                    trackColor={{ true: colors.primary }}
                />
            </View>

            <FormInput
                label="Note (optional)"
                value={note}
                onChangeText={setNote}
                error={errors.note}
                placeholder="e.g. Weekly shop"
                multiline
            />

            {/* Receipt photo */}
            <Text style={styles.label}>Receipt photo (optional)</Text>
            {photoUri ? <Image source={{ uri: photoUri }} style={styles.photo} /> : null}
            <View style={styles.photoButtons}>
                <PrimaryButton title="Take photo" variant="secondary" style={styles.photoButton} onPress={takePhoto} />
                <PrimaryButton title="Choose photo" variant="secondary" style={styles.photoButton} onPress={pickPhoto} />
            </View>
            {photoUri ? (
                <Pressable onPress={() => setPhotoUri(null)}>
                    <Text style={styles.removePhoto}>Remove photo</Text>
                </Pressable>
            ) : null}

            {serverError ? <Text style={styles.serverError}>{serverError}</Text> : null}

            <PrimaryButton
                title={editingExpense ? 'Save changes' : 'Add expense'}
                onPress={handleSave}
                loading={saving}
                style={styles.saveButton}
            />
        </KeyboardScreen>
    );
}

const styles = StyleSheet.create({
    label: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 6 },
    dateButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        marginBottom: 16,
    },
    dateText: { fontSize: 16, color: colors.text },
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    switchLabel: { fontSize: 16, color: colors.text },
    photo: { width: '100%', height: 180, borderRadius: 12, marginBottom: 10 },
    photoButtons: { flexDirection: 'row', gap: 12 },
    photoButton: { flex: 1 },
    removePhoto: { color: colors.danger, textAlign: 'center', marginTop: 12 },
    serverError: {
        color: colors.danger,
        backgroundColor: colors.dangerLight,
        padding: 10,
        borderRadius: 8,
        marginTop: 16,
    },
    saveButton: { marginTop: 24, marginBottom: 20 },
});
