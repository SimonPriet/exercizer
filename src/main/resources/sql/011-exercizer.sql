DELETE from exercizer.subject_tag AS st
  WHERE st.id NOT IN (SELECT DISTINCT sl.subject_tag_id FROM exercizer.subject_library_tag AS sl) AND st.label IN ('Facile', 'Intermédiaire', 'Difficile', 'Entrainement', 'Devoir maison', 'Contrôle');