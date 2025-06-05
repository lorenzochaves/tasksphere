import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import { useModal } from "../../contexts/ModalContext";
import { persistentApi } from "../../services/localStorageApi";
import Button from "../atoms/Button";
import Input from "../atoms/Input";
import Modal from "../atoms/Modal";
import { X, Calendar, FileText, Target, Users } from "lucide-react";
import type { Project } from "../../types";

interface EditProjectModalProps {
  onProjectUpdate?: (updatedProject: Project) => void;
}

const EditProjectModal: React.FC<EditProjectModalProps> = ({ onProjectUpdate }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { showEditProjectModal, editingProject, closeEditProjectModal } = useModal();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    start_date: "",
    end_date: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingProject) {
      setFormData({
        name: editingProject.name || "",
        description: editingProject.description || "",
        start_date: editingProject.start_date ? new Date(editingProject.start_date).toISOString().split('T')[0] : "",
        end_date: editingProject.end_date ? new Date(editingProject.end_date).toISOString().split('T')[0] : ""
      });
      setErrors({});
    }
  }, [editingProject]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nome do projeto é obrigatório";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Nome do projeto deve ter no mínimo 3 caracteres";
    } else if (formData.name.length > 70) {
      newErrors.name = "Nome do projeto deve ter no máximo 70 caracteres";
    }

    if (formData.start_date && formData.end_date) {
      const startDate = new Date(formData.start_date);
      const endDate = new Date(formData.end_date);
      if (startDate >= endDate) {
        newErrors.end_date = "Data de fim deve ser posterior à data de início";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !editingProject || !user) return;

    setIsSubmitting(true);

    try {
      const updateData: Partial<Project> = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        start_date: formData.start_date || undefined,
        end_date: formData.end_date || undefined,
        updated_at: new Date().toISOString()
      };

      const updatedProject = await persistentApi.updateProject(editingProject.id, updateData);

      toast({
        title: "Projeto atualizado!",
        description: "As alterações foram salvas com sucesso.",
        variant: "success"
      });

      closeEditProjectModal();
      
      // Call the callback to update parent state instead of reloading
      if (onProjectUpdate) {
        onProjectUpdate(updatedProject);
      }
    } catch (error) {
      console.error("Error updating project:", error);
      toast({
        title: "Erro ao atualizar projeto",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "error"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      closeEditProjectModal();
    }
  };

  if (!showEditProjectModal || !editingProject) return null;

  return (
<Modal isOpen={showEditProjectModal} onClose={handleClose} size="full">
  <div className="bg-[#21262d] rounded-lg w-full max-w-5xl mx-auto shadow-lg border border-[#30363d]">
    {/* Header */}
    <div className="flex items-center justify-between px-6 py-4 border-b border-[#30363d] sticky top-0 bg-[#21262d] z-10">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-[#238636] rounded-lg">
          <FileText className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-[#e6edf3]">Editar Projeto</h2>
          <p className="text-sm text-[#8b949e]">Atualize as informações do seu projeto</p>
        </div>
      </div>
      <button
        onClick={handleClose}
        disabled={isSubmitting}
        className="p-2 text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#30363d] rounded-lg transition-colors disabled:opacity-50"
      >
        <X className="w-5 h-5" />
      </button>
    </div>

    {/* Content */}
    <div className="flex flex-col md:flex-row overflow-hidden max-h-[80vh]">
      {/* Main Form */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#e6edf3] mb-2">Nome do Projeto *</label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Digite o nome do projeto"
              disabled={isSubmitting}
              className="w-full"
              maxLength={70}
            />
            <div className="flex justify-between mt-1">
              {errors.name && <p className="text-sm text-red-400">{errors.name}</p>}
              <p className={`text-xs ml-auto ${formData.name.length > 70 ? 'text-red-400' : 'text-[#8b949e]'}`}>
                {formData.name.length}/70
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#e6edf3] mb-2">Descrição</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={4}
              placeholder="Descreva os objetivos e escopo do projeto"
              disabled={isSubmitting}
              className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded text-sm text-[#c9d1d9] placeholder:text-[#8b949e] focus:outline-none focus:border-[#1f6feb] focus:ring-1 focus:ring-[#1f6feb] resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#e6edf3] mb-2">Data de Início</label>
              <Input
                type="date"
                value={formData.start_date}
                onChange={(e) => handleInputChange("start_date", e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#e6edf3] mb-2">Data de Fim</label>
              <Input
                type="date"
                value={formData.end_date}
                onChange={(e) => handleInputChange("end_date", e.target.value)}
                disabled={isSubmitting}
              />
              {errors.end_date && <p className="mt-1 text-sm text-red-400">{errors.end_date}</p>}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#238636] hover:bg-[#2ea043] text-white px-6 py-2.5 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar Alterações"
              )}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-6 py-2.5"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>

      {/* Sidebar */}
      <aside className="w-full md:w-80 border-t md:border-t-0 md:border-l border-[#30363d] p-6 bg-[#161b22] overflow-y-auto">
        <div className="space-y-6 text-sm">
          <div>
            <h3 className="font-medium text-[#e6edf3] mb-2 flex items-center gap-2">
              <Target className="w-4 h-4" /> Informações do Projeto
            </h3>
            <p className="text-[#8b949e]">Criado em:</p>
            <p className="text-[#e6edf3]">
              {editingProject.created_at ? new Date(editingProject.created_at).toLocaleDateString('pt-BR') : 'N/A'}
            </p>
            <p className="text-[#8b949e] mt-2">ID do Projeto:</p>
            <p className="text-[#e6edf3] font-mono text-xs">{editingProject.id}</p>
          </div>

          <div>
            <h3 className="font-medium text-[#e6edf3] mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Dicas de Atualização
            </h3>
            <ul className="text-[#8b949e] list-disc pl-5 space-y-1">
              <li>Mantenha o nome claro e descritivo (3-70 caracteres)</li>
              <li>Use a descrição para explicar objetivos</li>
              <li>Defina datas realistas</li>
              <li>As alterações são aplicadas na hora</li>
            </ul>
          </div>

          {editingProject.collaborators && editingProject.collaborators.length > 0 && (
            <div>
              <h3 className="font-medium text-[#e6edf3] mb-2 flex items-center gap-2">
                <Users className="w-4 h-4" /> Colaboradores ({editingProject.collaborators.length})
              </h3>
              <p className="text-[#8b949e]">
                Acesse o painel do projeto para gerenciar a equipe.
              </p>
            </div>
          )}
        </div>
      </aside>
    </div>
  </div>
</Modal>

  );
};

export default EditProjectModal;