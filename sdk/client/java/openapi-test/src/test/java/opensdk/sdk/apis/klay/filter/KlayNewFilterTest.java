package opensdk.sdk.apis.klay.filter;

import opensdk.sdk.apis.constant.UrlConstants;
import opensdk.sdk.models.KlayNewFilterResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.klaytn.OpenSDK;
import org.web3j.protocol.core.DefaultBlockParameter;
import org.web3j.protocol.core.methods.request.EthFilter;
import org.web3j.protocol.core.methods.request.Filter;

import java.io.IOException;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@DisplayName("Klay RPC Test")
public class KlayNewFilterTest {
    private final OpenSDK sdk = new OpenSDK(UrlConstants.SERVER_URL);
    @Test
    @DisplayName("RPC klay_newFilter")
    void whenRequestValid_ThenCall200ResponseReturns() throws IOException {
        Filter<EthFilter> filterOption = new EthFilter(DefaultBlockParameter.valueOf("latest")
                ,DefaultBlockParameter.valueOf("latest")
                ,"0x87ac99835e67168d4f9a40580f8f5c33550ba88b");
        filterOption.addOptionalTopics("0xd596fdad182d29130ce218f4c1590c4b5ede105bee36690727baa6592bd2bfc8");
        KlayNewFilterResponse response = sdk.klay.newFilter(filterOption).send();
        assertNotNull(response.getResult());
    }
}
