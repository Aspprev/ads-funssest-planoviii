/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react'
import { FiX } from 'react-icons/fi'
import Modal from 'react-modal'

interface ModalProps {
  isOpen: boolean
  onRequestClose: () => void
}

/*
 *** COMO CRIAR UM MODAL ***
 * 1º: Crie um state na pagina:
 * const [isModalOpen, setIsModalOpen] = useState(false)
 *
 * 2º: crie uma função para fechar o modal na página:
 * function handleCloseModal(): void {
 *  setIsModalOpen(false)
 * }
 *
 * 3º: Crie o componente (possui children!):
 * <ModalBox isOpen={isModalOpen} onRequestClose={handleCloseModal}>
 *
 * 4º: Seja feliz :D
 */

const ModalBox: React.FC<ModalProps> = ({
  isOpen,
  onRequestClose,
  children,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      overlayClassName="react-modal-overlay"
      className="react-modal-content"
    >
      <FiX onClick={onRequestClose} />
      {children}
    </Modal>
  )
}

export default ModalBox
