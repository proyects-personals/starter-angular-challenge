
export function validateId(id: string, isEdit: boolean): string {
  if (!id) return 'El ID es obligatorio.';
  if (id.length < 3 || id.length > 10) return 'El ID debe tener entre 3 y 10 caracteres.';
  return isEdit ? '' : '';
}

export function validateName(name: string): string {
  if (!name) return 'El nombre es obligatorio.';
  if (name.length < 5 || name.length > 100) return 'Debe tener entre 5 y 100 caracteres.';
  return '';
}

export function validateDescription(description: string): string {
  if (!description) return 'La descripción es obligatoria.';
  if (description.length < 10 || description.length > 200) return 'Debe tener entre 10 y 200 caracteres.';
  return '';
}

export function validateLogo(logo: string): string {
  return !logo ? 'El logo es obligatorio.' : '';
}

export function validateDateRelease(date: string): string {
  const today = new Date().setHours(0, 0, 0, 0);
  const releaseDate = new Date(date).setHours(0, 0, 0, 0);
  return releaseDate < today ? 'Debe ser hoy o en el futuro.' : '';
}

export function validateDateRevision(release: string, revision: string): string {
  const rDate = new Date(release);
  const revDate = new Date(revision);
  const expected = new Date(rDate);
  expected.setFullYear(expected.getFullYear() + 1);
  return revDate.toDateString() !== expected.toDateString()
    ? 'Debe ser exactamente un año después de la fecha de liberación.'
    : '';
}
