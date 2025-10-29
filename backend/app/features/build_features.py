import numpy as np
from typing import List
from ..schemas.io import StudentProfile

def featurize_profile(p: StudentProfile):
    len_courses = len(p.courses)
    len_projects = len(p.projects)
    len_certs   = len(p.certifications)
    gpa_mean    = float(np.mean(p.gpa_trend)) if p.gpa_trend else 0.0
    gpa_slope   = (p.gpa_trend[-1] - p.gpa_trend[0]) / max(1, len(p.gpa_trend)-1) if len(p.gpa_trend) > 1 else 0.0
    return [[len_courses, len_projects, len_certs, gpa_mean, gpa_slope]]
