// ==========================================================
// EASY MEAT — Editar Anúncio (wrapper)
// ==========================================================

import { useParams } from 'react-router-dom';
import AnuncioForm from '../NovoAnuncio/AnuncioForm.jsx';

export default function EditarAnuncio() {
  const { id } = useParams();
  return <AnuncioForm modo="editar" id={id} />;
}
