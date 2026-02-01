import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  Pressable, 
  StyleSheet 
} from "react-native";

const AVAILABLE_COLORS = [
  '#FF3B30', 
  '#FF9500', 
  '#FFCC00', 
  '#34C759',
  '#007AFF',
  '#5856D6', 
  '#AF52DE',
];

export const AddCategoryModal = ({ onAdd, onClose }: { onAdd: (cat: any) => void, onClose: () => void }) => {
  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState(AVAILABLE_COLORS[0]);

  const handleSave = () => {
    if (name.trim()) {
      onAdd({
        id: Date.now().toString(),
        name: name.trim(),
        color: selectedColor,
      });
      setName('');
    }
  };

  return (
    <View style={styles.modalContent}>
      <Text style={styles.label}>Category Name</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Reading, Gym, ...."
        style={styles.input} 
      />

      <Text style={styles.label}>Select Color</Text>
      <View style={styles.colorRow}>
        {AVAILABLE_COLORS.map(color => (
          <Pressable
            key={color}
            onPress={() => setSelectedColor(color)}
            style={[
              styles.colorCircle, 
              { backgroundColor: color },
              selectedColor === color && styles.selectedCircle
            ]}
          />
        ))}
      </View>

      <Pressable onPress={handleSave} style={styles.saveBtn}>
        <Text style={styles.saveBtnText}>Add Category</Text>
      </Pressable>
      
      <Pressable onPress={onClose} style={{ marginTop: 15, alignItems: 'center' }}>
        <Text style={{ color: '#A0AEC0' }}>Cancel</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContent: { 
    padding: 20, 
    backgroundColor: '#fff', 
    borderTopLeftRadius: 20, 
    borderTopRightRadius: 20,
    // لجعل المودال يبدو أفضل عند رفعه من الأسفل
    paddingBottom: 40 
  },
  label: { fontSize: 14, fontWeight: '700', marginBottom: 10, color: '#4A5568' },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
    fontSize: 16,
    color: '#000'
  },
  colorRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 30 
  },
  colorCircle: { 
    width: 34, 
    height: 34, 
    borderRadius: 17,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)'
  },
  selectedCircle: {
    borderWidth: 3,
    borderColor: '#000',
    transform: [{ scale: 1.2 }],
  },
  saveBtn: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});