import scholarshipsData from '../data/scholarships.json';

export const mockScholarshipService = {
  getAll: () => {
    const local = localStorage.getItem('mahasetu_scholarships');
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        console.error(e);
      }
    }
    localStorage.setItem('mahasetu_scholarships', JSON.stringify(scholarshipsData));
    return scholarshipsData;
  },

  getById: (id) => {
    const list = mockScholarshipService.getAll();
    return list.find((s) => s.id === id) || null;
  },

  filter: ({ search = '', course = '', category = '', status = '' }) => {
    let list = mockScholarshipService.getAll();
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.id.toLowerCase().includes(q)
      );
    }
    if (course) {
      list = list.filter((s) => s.eligibleCourses.some((c) => c.includes(course) || course.includes(c)));
    }
    if (category) {
      list = list.filter((s) => s.category === category);
    }
    if (status) {
      list = list.filter((s) => s.status === status);
    }
    return list;
  }
};
