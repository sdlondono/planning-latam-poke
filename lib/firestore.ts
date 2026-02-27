import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  type DocumentData,
  type WithFieldValue,
  setDoc
} from 'firebase/firestore'
import { db } from '@/lib/firebase'

/**
 * Creates a new document in the specified collection.
 * Automatically adds createdAt and updatedAt timestamps.
 *
 * @param collectionName The name of the collection
 * @param data The data to be added to the document
 * @returns The created document with its ID
 */
export const createDocument = async (
  collectionName: string,
  data: WithFieldValue<DocumentData>
) => {
  try {
    const colRef = collection(db, collectionName)
    const docRef = await addDoc(colRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
    return { id: docRef.id, ...data }
  } catch (error) {
    console.error(`Error creating document in ${collectionName}:`, error)
    throw error
  }
}

/**
 * Sets a document with a specific ID in the specified collection.
 * Automatically adds createdAt and updatedAt timestamps.
 * If merge is true, it will merge with existing data.
 *
 * @param collectionName The name of the collection
 * @param id The ID of the document to set
 * @param data The data to set
 * @param merge Whether to merge with existing data (default: false)
 * @returns The set data with ID
 */
export const setDocument = async (
  collectionName: string,
  id: string,
  data: WithFieldValue<DocumentData>,
  merge: boolean = false
) => {
  try {
    const docRef = doc(db, collectionName, id)
    await setDoc(
      docRef,
      {
        ...data,
        updatedAt: serverTimestamp(),
        ...(merge ? {} : { createdAt: serverTimestamp() })
      },
      { merge }
    )
    return { id, ...data }
  } catch (error) {
    console.error(`Error setting document ${id} in ${collectionName}:`, error)
    throw error
  }
}

/**
 * Updates an existing document in the specified collection.
 * Automatically updates the updatedAt timestamp.
 *
 * @param collectionName The name of the collection
 * @param id The ID of the document to update
 * @param data The data to update (partial update supported)
 * @returns The updated data with ID
 */
export const updateDocument = async (
  collectionName: string,
  id: string,
  data: WithFieldValue<DocumentData>
) => {
  try {
    const docRef = doc(db, collectionName, id)
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    })
    return { id, ...data }
  } catch (error) {
    console.error(`Error updating document ${id} in ${collectionName}:`, error)
    throw error
  }
}

/**
 * Deletes a document from the specified collection.
 *
 * @param collectionName The name of the collection
 * @param id The ID of the document to delete
 * @returns The ID of the deleted document
 */
export const deleteDocument = async (collectionName: string, id: string) => {
  try {
    const docRef = doc(db, collectionName, id)
    await deleteDoc(docRef)
    return id
  } catch (error) {
    console.error(
      `Error deleting document ${id} from ${collectionName}:`,
      error
    )
    throw error
  }
}
