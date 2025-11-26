import { alterarSenhaAdmin, alterarEmailAdmin } from "../../../../packages/firebase/auth";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";


import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Configuracoes() {
    const [modalSenha, setModalSenha] = useState(false);
    const [modalEmail, setModalEmail] = useState(false);
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false);
    const [mostrarSenhaEmail, setMostrarSenhaEmail] = useState(false);



    const [senhaAtual, setSenhaAtual] = useState("");
    const [novaSenha, setNovaSenha] = useState("");

    const [senhaAtualEmail, setSenhaAtualEmail] = useState("");
    const [novoEmail, setNovoEmail] = useState("");

    const [emailAtual, setEmailAtual] = useState("");
    const [confirmarNovoEmail, setConfirmarNovoEmail] = useState("");
    const [popupEmailEnviado, setPopupEmailEnviado] = useState(false);
    const router = useRouter();

    const [popupMensagem, setPopupMensagem] = useState({
        visible: false,
        titulo: "",
        mensagem: ""
    });

    function mostrarPopup(titulo, mensagem) {
        setPopupMensagem({
            visible: true,
            titulo,
            mensagem
        });
    }


    async function salvarNovaSenha() {
        const resultado = await alterarSenhaAdmin(senhaAtual, novaSenha);

        if (!resultado.ok) {
            const code = resultado.error.code;

            if (code === "auth/invalid-credential") {
                mostrarPopup(
                    "Senha incorreta",
                    "A senha atual está errada.\nVerifique e tente novamente."
                );
            }
            else if (code === "auth/weak-password") {
                mostrarPopup(
                    "Senha fraca",
                    "A nova senha é muito fraca.\nUse uma senha mais segura."
                );
            }
            else {
                mostrarPopup(
                    "Erro",
                    resultado.error.message || "Erro ao alterar senha."
                );
            }

            return;
        }

        // SUCESSO
        mostrarPopup(
            "Sucesso!",
            "Senha alterada com sucesso."
        );

        setModalSenha(false);
    }


    async function salvarNovoEmail() {

        if (!emailAtual || !senhaAtualEmail || !novoEmail || !confirmarNovoEmail) {
            mostrarPopup("Campos obrigatórios", "Preencha todos os campos antes de continuar.");
            return;
        }

        if (novoEmail !== confirmarNovoEmail) {
            mostrarPopup("Emails não conferem", "O novo email e a confirmação devem ser iguais.");
            return;
        }


        const resultado = await alterarEmailAdmin(senhaAtualEmail, novoEmail);

        if (!resultado.ok) {
            const code = resultado.error.code;

            if (code === "auth/invalid-credential") {
                mostrarPopup("Senha incorreta", "A senha atual digitada está errada.");
            }
            else if (code === "auth/email-already-in-use") {
                mostrarPopup("Email já utilizado", "Esse email já está cadastrado. Tente outro.");
            }
            else if (code === "auth/invalid-email") {
                mostrarPopup("Email inválido", "Digite um email válido.");
            }
            else {
                mostrarPopup("Erro ao alterar email", resultado.error.message);
            }

            return;
        }

        // SUCESSO
        setModalEmail(false);
        setPopupEmailEnviado(true);
    }


    return (
        <View style={styles.container}>

            {/* TÍTULO */}
            <SafeAreaView style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={26} color="#FFD700" />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>Configurações</Text>
            </SafeAreaView>


            {/* ---------------------- SEÇÃO CONTA ---------------------- */}
            <Text style={styles.sectionTitle}>Conta</Text>

            <View style={styles.card}>

                <TouchableOpacity
                    style={styles.cardItem}
                    onPress={() => setModalSenha(true)}
                >
                    <Ionicons name="shield-checkmark-outline" size={22} color="#000" />
                    <Text style={styles.cardText}>Alterar senha</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.cardItem}
                    onPress={() => setModalEmail(true)}
                >
                    <Ionicons name="shield-outline" size={22} color="#000" />
                    <Text style={styles.cardText}>Alterar email</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.cardItem}
                    onPress={() => router.push("/")}
                >
                    <Ionicons name="notifications-outline" size={22} color="#000" />
                    <Text style={styles.cardText}>Notificações</Text>
                </TouchableOpacity>


            </View>

            {/* ---------------------- SEÇÃO AÇÕES ---------------------- */}
            <Text style={styles.sectionTitle}>Ações</Text>

            <View style={styles.card}>

                <TouchableOpacity
                    style={styles.cardItem}
                    onPress={() => router.push("/AdminManagerScreen")}
                >
                    <Ionicons name="people-outline" size={22} color="#000" />
                    <Text style={styles.cardText}>Gerenciar administradores</Text>
                </TouchableOpacity>



            </View>

            {/* --------------------- MODAL ALTERAR SENHA --------------------- */}
            <Modal visible={modalSenha} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>Alterar senha</Text>

                        {/* CAMPO SENHA ATUAL */}
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.inputSenha}
                                placeholder="Senha atual"
                                secureTextEntry={!mostrarSenha}
                                value={senhaAtual}
                                onChangeText={setSenhaAtual}
                            />
                            <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}>
                                <Ionicons
                                    name={mostrarSenha ? "eye-off-outline" : "eye-outline"}
                                    size={24}
                                    color="#555"
                                />
                            </TouchableOpacity>
                        </View>

                        {/* CAMPO NOVA SENHA */}
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.inputSenha}
                                placeholder="Nova senha"
                                secureTextEntry={!mostrarNovaSenha}
                                value={novaSenha}
                                onChangeText={setNovaSenha}
                            />
                            <TouchableOpacity onPress={() => setMostrarNovaSenha(!mostrarNovaSenha)}>
                                <Ionicons
                                    name={mostrarNovaSenha ? "eye-off-outline" : "eye-outline"}
                                    size={24}
                                    color="#555"
                                />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={styles.btnSalvar} onPress={salvarNovaSenha}>
                            <Text style={styles.btnSalvarText}>Salvar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.btnCancelar}
                            onPress={() => setModalSenha(false)}
                        >
                            <Text style={styles.btnCancelarText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>


            {/* --------------------- MODAL ALTERAR EMAIL --------------------- */}
            <Modal visible={modalEmail} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>Alterar email</Text>

                        {/* EMAIL ATUAL */}
                        <TextInput
                            style={styles.input}
                            placeholder="Email atual"
                            value={emailAtual}
                            onChangeText={setEmailAtual}
                        />

                        {/* SENHA ATUAL + OLHO */}
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.inputSenha}
                                placeholder="Senha atual"
                                secureTextEntry={!mostrarSenhaEmail}
                                value={senhaAtualEmail}
                                onChangeText={setSenhaAtualEmail}
                            />
                            <TouchableOpacity onPress={() => setMostrarSenhaEmail(!mostrarSenhaEmail)}>
                                <Ionicons
                                    name={mostrarSenhaEmail ? "eye-off-outline" : "eye-outline"}
                                    size={24}
                                    color="#555"
                                />
                            </TouchableOpacity>
                        </View>

                        {/* NOVO EMAIL */}
                        <TextInput
                            style={styles.input}
                            placeholder="Novo email"
                            value={novoEmail}
                            onChangeText={setNovoEmail}
                        />

                        {/* CONFIRMAR EMAIL */}
                        <TextInput
                            style={styles.input}
                            placeholder="Confirmar novo email"
                            value={confirmarNovoEmail}
                            onChangeText={setConfirmarNovoEmail}
                        />

                        {/* BOTÃO SALVAR */}
                        <TouchableOpacity style={styles.btnSalvar} onPress={salvarNovoEmail}>
                            <Text style={styles.btnSalvarText}>Salvar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.btnCancelar}
                            onPress={() => setModalEmail(false)}
                        >
                            <Text style={styles.btnCancelarText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* --------------------- POPUP EMAIL ENVIADO --------------------- */}
            <Modal visible={popupEmailEnviado} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalPopup}>
                        <Text style={styles.popupTitle}>Verifique seu email</Text>

                        <Text style={styles.popupMsg}>
                            Enviamos um link para confirmar o novo email.{"\n\n"}
                            Pode ter ido para SPAM / lixo eletrônico.{"\n\n"}
                            A alteração só será concluída após a confirmação.
                        </Text>

                        <TouchableOpacity
                            style={styles.popupBtn}
                            onPress={() => setPopupEmailEnviado(false)}
                        >
                            <Text style={styles.popupBtnText}>Entendi</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>


            {/* ------------------- POPUP SENHA ------------------- */}
            <Modal visible={popupMensagem.visible} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalPopup}>
                        <Text style={styles.popupTitle}>{popupMensagem.titulo}</Text>

                        <Text style={styles.popupMsg}>{popupMensagem.mensagem}</Text>

                        <TouchableOpacity
                            style={styles.popupBtn}
                            onPress={() =>
                                setPopupMensagem({
                                    visible: false,
                                    titulo: "",
                                    mensagem: ""
                                })
                            }
                        >
                            <Text style={styles.popupBtnText}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

        </View>
    );
}

/* ------------------- ESTILOS ------------------- */
const styles = StyleSheet.create({
header: {
    backgroundColor: "#000",
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
},


    header: {
        backgroundColor: "#000",
        paddingVertical: 18,
        paddingHorizontal: 15,
        borderRadius: 10,
        marginBottom: 20,
    },
    headerTitle: {
        color: "#FFD700",
        fontSize: 20,
        fontWeight: "bold",
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 10,
        marginBottom: 8,
        paddingLeft: 5,
    },

    card: {
        backgroundColor: "#EEE",
        borderRadius: 10,
        paddingVertical: 5,
        marginBottom: 20,
    },

    cardItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderBottomColor: "#ddd",
        borderBottomWidth: 1,
        gap: 12,
    },

    cardText: {
        fontSize: 16,
        color: "#000",
        fontWeight: "500",
    },

    /* MODAL */
    modalOverlay: {
        flex: 1,
        backgroundColor: "#00000066",
        justifyContent: "center",
        alignItems: "center",
    },

    modalBox: {
        width: "90%",
        backgroundColor: "#FFF",
        padding: 20,
        borderRadius: 12,
        elevation: 10,
    },

    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 15,
        textAlign: "center",
    },

    input: {
        backgroundColor: "#F2F2F2",
        padding: 12,
        borderRadius: 8,
        marginTop: 10,
    },

    btnSalvar: {
        backgroundColor: "#FFD700",
        padding: 12,
        borderRadius: 8,
        marginTop: 20,
    },

    btnSalvarText: {
        textAlign: "center",
        fontWeight: "bold",
        color: "#000",
    },

    btnCancelar: {
        padding: 12,
        borderRadius: 8,
        marginTop: 10,
    },

    btnCancelarText: {
        textAlign: "center",
        fontWeight: "bold",
        color: "#444",
    },

    /* POPUP */
    modalPopup: {
        width: "85%",
        backgroundColor: "#FFF",
        padding: 20,
        borderRadius: 12,
        alignItems: "center",
        elevation: 15,
    },

    popupTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
    },

    popupMsg: {
        fontSize: 16,
        color: "#444",
        textAlign: "center",
        marginBottom: 20,
    },

    popupBtn: {
        backgroundColor: "#FFD700",
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 8,
    },

    popupBtnText: {
        fontSize: 16,
        fontWeight: "700",
        color: "#000",
    },

    /* CAMPOS DE SENHA COM OLHO */
    inputContainer: {
        backgroundColor: "#F2F2F2",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        borderRadius: 8,
        marginTop: 10,
    },

    inputSenha: {
        flex: 1,
        paddingVertical: 12,
    },


  header: {
    backgroundColor: "#000",
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
},


});
