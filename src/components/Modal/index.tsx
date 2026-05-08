/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react'
import { FiX } from 'react-icons/fi'
import Modal from 'react-modal'

interface ModalProps {
  isOpen: boolean
  onRequestClose: () => void
  children?: React.ReactNode
}

const ModalBox: React.FC<ModalProps> = ({
  isOpen,
  onRequestClose,
  children,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      overlayClassName="fixed inset-0 z-20 overflow-y-auto bg-black/55 px-4 py-6"
      className="relative mx-auto my-auto flex max-h-[calc(100vh-3rem)] w-full max-w-125 flex-col overflow-hidden rounded bg-panel-muted outline-none max-md:max-w-100"
      ariaHideApp={false}
    >
      <FiX
        className="absolute right-5 top-5 size-5 cursor-pointer text-danger"
        onClick={onRequestClose}
      />
      <div className="overflow-y-auto px-6 py-9">{children}</div>
    </Modal>
  )
}

export default ModalBox
