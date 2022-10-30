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
import { useState } from "react";

export default function OTPModal() {
  const [otp, setOTP] = useState("")
  const handleChange = event => {
    setOTP(event.target.value);

    console.log('value is:', event.target.value);
  };
  const {
    isOpen: isFirstModalOpen,
    onOpen: onFirstModalOpen,
    onClose: onFirstModalClose,
  } = useDisclosure();

  const {
    isOpen: isSecondModalOpen,
    onOpen: onSecondModalOpen,
    onClose: onSecondModalClose,
  } = useDisclosure();

  return (
    <>
      <Button float={"right"} colorScheme="green" onClick={onFirstModalOpen}>
        Submit
      </Button>

      <Modal
        closeOnEsc={false}
        isOpen={isFirstModalOpen}
        onClose={onFirstModalClose}>
        <ModalOverlay />
        <ModalContent mt={"60"}>
          <ModalHeader textAlign={"center"}>Payment OTP</ModalHeader>
          <ModalCloseButton />
            <FormControl isRequired>
          <ModalBody>
              <FormLabel>OTP</FormLabel>
              <Input bg="white" type="number" onChange={handleChange}/>
          </ModalBody>

          <ModalFooter justifyContent={"center"}>
            <Button
              colorScheme="green"
              onClick={() => {
                if (otp.length > 0) {
                  onFirstModalClose();
                  onSecondModalOpen();  
                }
              }}>
              Submit
            </Button>
          </ModalFooter>
            </FormControl>
        </ModalContent>
      </Modal>

      <>
        <Modal
          closeOnEsc={false}
          isOpen={isSecondModalOpen}
          onClose={onSecondModalClose}>
          <ModalOverlay />
          <ModalContent mt={"60"}>
            <ModalHeader textAlign={"center"}>Payment Sucessful!</ModalHeader>
            <ModalCloseButton onClick={() => {
              onFirstModalClose()
              window.location.href = '/dashboard'
            }} />
          </ModalContent>
        </Modal>
      </>
    </>
  );
}
