import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";

export default function SuccessModal(props) {
  const { isOpen: isSecondModalOpen , onOpen: onSecondModalOpen, onClose: onSecondModalClose } = useDisclosure()
  return (
    <>
      <Button colorScheme="green" mr={3} onClick={() => {
        props.firstModalClose()
        onSecondModalOpen()
      }}>
        Submit
      </Button>

      <Modal closeOnEsc={false} isOpen={isSecondModalOpen} onClose={onSecondModalClose}>
        <ModalOverlay />
        <ModalContent mt={"60"}>
          <ModalHeader>Payment Sucessful!</ModalHeader>
          <ModalCloseButton onClick={props.firstModalClose} />
        </ModalContent>
      </Modal>
    </>
  );
}
